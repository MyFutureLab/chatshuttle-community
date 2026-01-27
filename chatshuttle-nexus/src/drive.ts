import { authService } from './auth.js';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CACHE_DIR = path.join(os.homedir(), '.chatshuttle', 'cache');
const INDEX_FILE = path.join(CACHE_DIR, 'index.voy');
const METADATA_FILE = path.join(CACHE_DIR, 'metadata.json');

export class DriveService {

    private async getDriveClient() {
        const auth = await authService.getClient();
        return google.drive({ version: 'v3', auth });
    }

    /**
     * Ensures we have the latest index and metadata from Drive.
     * Uses simplistic "if missing" check for now. 
     * In PROD, we should check `modifiedTime`.
     */
    async syncFiles() {
        // Ensure cache dir
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }

        const drive = await this.getDriveClient();

        // 1. Find the Folders
        // We look for 'ChatShuttle_Memories/_VectorIndex'
        const qFolder = "mimeType = 'application/vnd.google-apps.folder' and name = 'ChatShuttle_Memories' and trashed = false";
        const folderRes = await drive.files.list({ q: qFolder });

        if (!folderRes.data.files || folderRes.data.files.length === 0) {
            throw new Error('ChatShuttle folder not found in Drive. Please use the Extension to sync first.');
        }
        const rootId = folderRes.data.files[0].id;

        const qIndexFolder = `mimeType = 'application/vnd.google-apps.folder' and name = '_VectorIndex' and '${rootId}' in parents and trashed = false`;
        const indexFolderRes = await drive.files.list({ q: qIndexFolder });

        if (!indexFolderRes.data.files || indexFolderRes.data.files.length === 0) {
            throw new Error('Vector Index folder not found. Has the Extension synced yet?');
        }
        const indexFolderId = indexFolderRes.data.files[0].id; // Type assertion

        // 2. Download index.voy
        await this.downloadFileIfNeeded(drive, indexFolderId, 'index.voy', INDEX_FILE);

        // 3. Download metadata.json
        await this.downloadFileIfNeeded(drive, indexFolderId, 'metadata.json', METADATA_FILE);
    }

    private async downloadFileIfNeeded(drive: any, folderId: any, name: string, destPath: string) {
        // Find file ID and modifiedTime
        const q = `'${folderId}' in parents and name = '${name}' and trashed = false`;
        const res = await drive.files.list({ q, fields: 'files(id, modifiedTime)' });

        if (!res.data.files || res.data.files.length === 0) {
            // Warn but don't crash, maybe it doesn't exist yet
            console.warn(`Warning: Remote file ${name} not found.`);
            return;
        }

        const file = res.data.files[0];
        const fileId = file.id;
        const remoteModifiedTime = new Date(file.modifiedTime).getTime();

        // Check if local file exists and is up-to-date
        if (fs.existsSync(destPath)) {
            const localStats = fs.statSync(destPath);
            const localModifiedTime = localStats.mtimeMs;

            if (localModifiedTime >= remoteModifiedTime) {
                // Local file is up-to-date, skip download
                return;
            }
        }

        // Download the file (either missing or outdated)
        const dest = fs.createWriteStream(destPath);

        const downloadRes = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        await new Promise<void>((resolve, reject) => {
            downloadRes.data
                .on('end', () => resolve())
                .on('error', (err: any) => reject(err))
                .pipe(dest);
        });

        // Update local file's mtime to match remote
        const mtime = new Date(file.modifiedTime);
        fs.utimesSync(destPath, mtime, mtime);
    }

    getPaths() {
        return {
            index: INDEX_FILE,
            metadata: METADATA_FILE
        };
    }
}

export const driveService = new DriveService();
