import { driveService } from './drive.js';
import { Voy } from 'voy-search';
import Fuse from 'fuse.js';
import fs from 'fs';
// @ts-ignore - Transformer.js types might differ in Node
import { pipeline, env } from '@xenova/transformers';

// Configure transformers for Node environment
env.allowLocalModels = false; // Fetch from Hub first time
env.useBrowserCache = false; // Use Node cache path

// Types matching the Metadata structure from Extension
interface ChunkMetadata {
    title: string;
    text: string;
    convId: string;
}

interface SearchResult {
    id: string; // Chunk ID
    score: number;
    title: string;
    text: string;
    source: 'vector' | 'keyword' | 'hybrid';
}

export class SearchService {
    private voy: any | null = null;
    private metadata: Record<string, ChunkMetadata> = {};
    private fuse: Fuse<any> | null = null;
    private extractor: any | null = null;

    async init() {
        // 1. Sync latest from Cloud
        await driveService.syncFiles();

        const paths = driveService.getPaths();

        // 2. Load Metadata (Text Source)
        if (fs.existsSync(paths.metadata)) {
            this.metadata = JSON.parse(fs.readFileSync(paths.metadata, 'utf-8'));
        }

        // 3. Init Voy (Vector Source)
        if (fs.existsSync(paths.index) && Object.keys(this.metadata).length > 0) {
            const indexData = fs.readFileSync(paths.index);
            // Voy 0.6.3 deserialization
            // Note: In Node, we might need a specific WASM build or import.
            // Assuming standard voy-search works in Node environment with readFileSync buffer.
            const decoder = new TextDecoder();
            const serialized = decoder.decode(indexData);
            if (serialized) {
                this.voy = Voy.deserialize(serialized);
            }
        }

        // 4. Init Fuse.js (Keyword Source)
        // We create a list for Fuse from the metadata map
        const fuseList = Object.entries(this.metadata).map(([id, data]) => ({
            id,
            ...data
        }));

        this.fuse = new Fuse(fuseList, {
            keys: ['title', 'text'],
            includeScore: true,
            threshold: 0.4 // Fuzzy equivalent
        });

        // 5. Init Embedding Model (Local)
        // Matches extension: Xenova/all-MiniLM-L6-v2
        if (!this.extractor) {
            console.log('Initializing local embedding model (downloading if needed)...');
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }
    }

    private async getEmbedding(text: string): Promise<number[]> {
        if (!this.extractor) return [];
        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    /**
     * THE HYBRID SEARCH ALGO (RRF - Reciprocal Rank Fusion)
     */
    async search(query: string, limit = 5): Promise<SearchResult[]> {
        if (!this.voy || !this.fuse) await this.init();

        const resultsMap = new Map<string, SearchResult>();
        const RRF_K = 60; // Standard RRF constant
        const scores = new Map<string, number>();

        // A. Keyword Search (Fuse)
        const fuseResults = this.fuse?.search(query, { limit: 20 }) || [];
        fuseResults.forEach((res: any, rank: number) => {
            const id = res.item.id;
            // RRF Score accumulation
            const rrf = 1 / (RRF_K + rank + 1);
            scores.set(id, (scores.get(id) || 0) + rrf);

            resultsMap.set(id, {
                id,
                title: res.item.title,
                text: res.item.text,
                score: 0, // Will update later
                source: 'keyword'
            });
        });

        // B. Vector Search (Voy)
        if (this.voy && this.extractor) {
            try {
                const queryVec = await this.getEmbedding(query);
                // Voy search returns { neighbors: [...] }
                // @ts-ignore
                const voyResult = this.voy.search(new Float32Array(queryVec), 20);
                const neighbors = voyResult?.neighbors || [];

                neighbors.forEach((res: any, rank: number) => {
                    const id = res.id;
                    const rrf = 1 / (RRF_K + rank + 1);
                    scores.set(id, (scores.get(id) || 0) + rrf);

                    const meta = this.metadata[id];
                    if (meta) {
                        // If it existed in keyword results, great, we just boosted score.
                        // If not, add it.
                        if (!resultsMap.has(id)) {
                            resultsMap.set(id, {
                                id,
                                title: meta.title,
                                text: meta.text,
                                score: 0,
                                source: 'vector'
                            });
                        } else {
                            // Upgrade source to hybrid if found in both
                            const existing = resultsMap.get(id)!;
                            existing.source = 'hybrid';
                        }
                    }
                });
            } catch (e) {
                console.error("Vector search failed:", e);
            }
        }

        // Final Sort by Combined RRF Score
        const finalResults = Array.from(resultsMap.values()).map(r => {
            r.score = scores.get(r.id) || 0;
            return r;
        });

        return finalResults
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}

export const searchService = new SearchService();
