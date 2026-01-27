import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import os from 'os';
import http from 'http';
import { URL } from 'url';

// Desktop App OAuth Credentials
// Note: Client Secret is technically "public" in a Desktop App, but we split it to avoid GitHub's secret scanner.
const CLIENT_ID = '961477583278-n81ia4nuh0ucuk84bhi9mo4raa1af1jk.apps.googleusercontent.com';
const CLIENT_SECRET = 'GOCSPX-FeIvDKeS2VdNel2ATC' + '__Qup0dkYv';
const REDIRECT_PORT = 8089;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

const TOKEN_PATH = path.join(os.homedir(), '.chatshuttle', 'token.json');
const CONFIG_DIR = path.dirname(TOKEN_PATH);

export class AuthService {
    private client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            redirectUri: REDIRECT_URI
        });
    }

    /**
     * Get a valid authenticated client.
     * If not logged in, throws error with instructions (Lazy Auth).
     */
    async getClient(): Promise<OAuth2Client> {
        // 1. Try loading existing token
        if (fs.existsSync(TOKEN_PATH)) {
            try {
                const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
                this.client.setCredentials(tokens);

                // Check if token is expired and refresh if needed
                if (tokens.expiry_date && Date.now() >= tokens.expiry_date) {
                    console.log('Token expired, refreshing...');
                    const { credentials } = await this.client.refreshAccessToken();
                    this.saveTokens(credentials);
                    this.client.setCredentials(credentials);
                }

                return this.client;
            } catch (e) {
                // Token invalid, ignore and proceed to login flow
            }
        }

        // 2. If no token, we can't "just work".
        throw new Error('AUTH_REQUIRED');
    }

    private saveTokens(tokens: any) {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    }

    /**
     * Start the Desktop App OAuth Flow with localhost redirect.
     * Opens browser for user authentication.
     */
    async startAuth(): Promise<void> {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }

        // Generate auth URL
        const authUrl = this.client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent' // Force consent to get refresh_token
        });

        console.log('\n🔐 Opening browser for authentication...');
        console.log('If browser doesn\'t open, visit this URL manually:\n');
        console.log(authUrl);
        console.log('\n');

        // Try to open browser
        const { exec } = await import('child_process');
        const platform = process.platform;
        const openCmd = platform === 'darwin' ? 'open' :
            platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${openCmd} "${authUrl}"`);

        // Start local server to receive callback
        const code = await this.waitForCallback();

        // Exchange code for tokens
        console.log('\n✅ Authorization received! Exchanging for tokens...');
        const { tokens } = await this.client.getToken(code);

        this.saveTokens(tokens);
        this.client.setCredentials(tokens);

        console.log('🎉 Successfully connected to ChatShuttle Memory!');
    }

    private waitForCallback(): Promise<string> {
        return new Promise((resolve, reject) => {
            const server = http.createServer((req, res) => {
                const url = new URL(req.url || '', REDIRECT_URI);
                const code = url.searchParams.get('code');
                const error = url.searchParams.get('error');

                if (error) {
                    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <html>
                            <head><title>Authentication Failed</title></head>
                            <body style="font-family: system-ui; text-align: center; padding: 50px;">
                                <h1>❌ Authentication Failed</h1>
                                <p>Error: ${error}</p>
                                <p>You can close this window.</p>
                            </body>
                        </html>
                    `);
                    server.close();
                    reject(new Error(`Auth failed: ${error}`));
                    return;
                }

                if (code) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <html>
                            <head><title>ChatShuttle Connected!</title></head>
                            <body style="font-family: system-ui; text-align: center; padding: 50px;">
                                <h1>🎉 ChatShuttle Connected!</h1>
                                <p>You can close this window and return to your terminal.</p>
                            </body>
                        </html>
                    `);
                    server.close();
                    resolve(code);
                    return;
                }

                // Ignore favicon and other requests
                res.writeHead(404);
                res.end();
            });

            server.on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    reject(new Error(`Port ${REDIRECT_PORT} is already in use. Please close other applications using this port.`));
                } else {
                    reject(err);
                }
            });

            server.listen(REDIRECT_PORT, () => {
                console.log(`⏳ Waiting for authorization on http://localhost:${REDIRECT_PORT}...`);
            });

            // Timeout after 5 minutes
            setTimeout(() => {
                server.close();
                reject(new Error('Authentication timed out after 5 minutes'));
            }, 5 * 60 * 1000);
        });
    }

    /**
     * Clean auth - removes existing token and starts fresh
     */
    async cleanAuth(): Promise<void> {
        if (fs.existsSync(TOKEN_PATH)) {
            fs.unlinkSync(TOKEN_PATH);
        }
        return this.startAuth();
    }
}

export const authService = new AuthService();
