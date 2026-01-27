import { Command } from 'commander';
import { authService } from './auth.js';
import { searchService } from './search.js';

const program = new Command();

program
    .name('nexus')
    .description('ChatShuttle Nexus - Universal Memory Bridge')
    .version('1.0.0');

program
    .command('auth')
    .description('Authenticate with ChatShuttle (Google Drive)')
    .action(async () => {
        try {
            // Check if already authed
            try {
                await authService.getClient();
                console.log('✅ Already authenticated and ready.');
                return;
            } catch (e) {
                // Ignore, proceed to auth
            }

            await authService.startAuth();
        } catch (error: any) {
            console.error('❌ Auth failed:', error.message);
            process.exit(1);
        }
    });

program
    .command('search <query>')
    .description('Search your AI memory')
    .option('-j, --json', 'Output results as strict JSON')
    .option('-l, --limit <number>', 'Max results', '5')
    .action(async (query, options) => {
        try {
            const results = await searchService.search(query, parseInt(options.limit));

            if (options.json) {
                console.log(JSON.stringify({ results }, null, 2));
            } else {
                if (results.length === 0) {
                    console.log('No matching memories found.');
                    return;
                }

                console.log(`Found ${results.length} memories for "${query}":\n`);
                results.forEach((res, i) => {
                    console.log(`[${i + 1}] ${res.title} (Score: ${res.score.toFixed(2)})`);
                    console.log(`    ${res.text.substring(0, 150).replace(/\n/g, ' ')}...`);
                    console.log(`    ID: ${res.id}\n`);
                });
            }
        } catch (error: any) {
            if (options.json) {
                console.log(JSON.stringify({ error: error.message }));
            } else {
                if (error.message === 'AUTH_REQUIRED' || error.message.includes('No auth token')) {
                    console.log('Authentication required. Run "nexus auth" to connect.');
                } else {
                    console.error('Search Error:', error.message);
                }
            }
            process.exit(1);
        }
    });

program.parse();
