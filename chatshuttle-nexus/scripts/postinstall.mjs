#!/usr/bin/env node
// This script patches voy-search to work with Node.js ESM modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const voyPkgPath = path.join(__dirname, '../node_modules/voy-search/package.json');

if (fs.existsSync(voyPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(voyPkgPath, 'utf-8'));

    // Add exports field to make voy-search work with Node.js ESM
    if (!pkg.exports) {
        pkg.exports = {
            ".": {
                "import": "./voy_search.js",
                "types": "./voy_search.d.ts"
            }
        };
        pkg.main = "./voy_search.js";

        fs.writeFileSync(voyPkgPath, JSON.stringify(pkg, null, 2));
        console.log('✅ Patched voy-search for Node.js ESM compatibility');
    } else {
        console.log('ℹ️ voy-search already patched');
    }
} else {
    console.log('⚠️ voy-search not found, skipping patch');
}
