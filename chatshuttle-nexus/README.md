# ChatShuttle Nexus 🧠

**Give Your AI Agents Access to Your Past Conversations.**

> Seamlessly connect your history from Gemini, Claude, and ChatGPT to your local AI tools (Claude Code, Cursor, Antigravity, etc.).

---

## ⚠️ Current Status: Pending Google Approval

This app uses Google Drive API and requires OAuth verification. We are currently **in the Google approval queue** (typically 1-3 weeks).

During this period, please follow the **Manual Setup** instructions below as a workaround.

---

## Why Use This?

Imagine your local AI coding assistant (like Cursor or Claude Code) knowing exactly how you solved a bug in a chat 3 months ago.

**ChatShuttle Nexus** acts as a bridge. It allows your local agents to "remember" everything you've ever discussed with web AIs.

- **Stop Repeating Yourself**: Don't waste time explaining context your other AIs already know.
- **Universal Memory**: Search across all your platforms (Gemini, ChatGPT, Claude) in one place.
- **Privacy First**: Your data stays in your Google Drive and is processed locally. No new accounts, no monthly fees.

---

## How It Works

1. **ChatShuttle Chrome Extension**: Auto-syncs your web chats to your private Google Drive.
2. **Nexus Skill**: A simple tool your local Agent uses to "search" that history when it needs help.

---

## Installation

### Prerequisites

- Node.js v18+
- npm
- ChatShuttle Chrome Extension (installed and synced at least once)

### Step 1: Clone and Build

```bash
git clone https://github.com/MyFutureLab/chatshuttle-community.git
cd chatshuttle-community/chatshuttle-nexus
npm install
npm run build
```

> **Note**: If you encounter npm cache permission errors, run:
> ```bash
> sudo chown -R $(whoami) ~/.npm
> ```

---

## Authentication

### Option A: OAuth Authentication (After Approval)

Once Google approval is complete, simply run:

```bash
npm run auth
```

This will:
1. 🌐 Open your browser for Google login
2. ⏳ Wait for authorization on `http://localhost:8089`
3. 🎉 Save your credentials locally

### Option B: Manual Setup (Current Workaround)

While waiting for Google approval, you can manually set up the required files:

#### Step 1: Locate Files in Google Drive

1. Open [Google Drive](https://drive.google.com)
2. Navigate to: `ChatShuttle_Memories/_VectorIndex/`
3. Download these two files:
   - `index.voy`
   - `metadata.json`

#### Step 2: Place Files Locally

```bash
mkdir -p ~/.chatshuttle/cache
# Copy your downloaded files to this directory
cp ~/Downloads/index.voy ~/.chatshuttle/cache/
cp ~/Downloads/metadata.json ~/.chatshuttle/cache/
```

#### Step 3: Verify Setup

```bash
npm run search -- "test query" --json
```

---

## Usage

### Search Your Memory (for example)

```bash
# Basic search
npm run search -- "python image resize"

# JSON output (for AI agents)
npm run search -- "authentication schema" --json
```

### Let Your AI Agent Use It

- **For Claude Code/MCP**: Add to your `~/.claude.json`:
  ```json
  {
    "mcpServers": {
      "nexus": {
        "command": "node",
        "args": ["--experimental-wasm-modules", "/path/to/chatshuttle-nexus/dist/cli.js", "search", "--json"]
      }
    }
  }
  ```

- **For Cursor**: See [USAGE.md](./USAGE.md) for detailed configuration.

- **For Antigravity/Clawdbot**: Ensure this folder is in your skills path.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `EPERM: operation not permitted` | Run `sudo chown -R $(whoami) ~/.npm` |
| `ExperimentalWarning: Importing WebAssembly modules` | This is normal, can be ignored |
| `AUTH_REQUIRED` error | Run `npm run auth` or use Manual Setup |
| `ChatShuttle folder not found` | Sync with ChatShuttle Chrome Extension first |

---

## Project Structure

```
chatshuttle-nexus/
├── bin/nexus          # CLI entry point
├── src/
│   ├── auth.ts        # OAuth authentication
│   ├── cli.ts         # CLI commands
│   ├── drive.ts       # Google Drive sync
│   └── search.ts      # Hybrid vector + keyword search
├── scripts/
│   └── postinstall.mjs # ESM compatibility patch
└── dist/              # Compiled JavaScript
```

---

## After Google Approval

Once approved, the OAuth flow will work seamlessly:

1. Users can run `npm run auth` directly
2. No manual file downloading required
3. Automatic sync of latest memories

We will update this README when approval is complete.

---

*Part of the ChatShuttle Ecosystem.*
