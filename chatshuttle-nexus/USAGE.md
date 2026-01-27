# ChatShuttle Nexus: Integration Guide

ChatShuttle Nexus is designed to be the "Universal Memory Bridge" for your AI agents. This guide explains how to connect it to the most popular AI coding tools.

## Prerequisites
1.  **Node.js**: Ensure Node.js (v18+) is installed.
2.  **ChatShuttle Chrome Extension**: Installed and synced at least once.
3.  **Installation**:
    ```bash
    # Clone and build
    git clone https://github.com/MyFutureLab/chatshuttle-community.git
    cd chatshuttle-community/chatshuttle-nexus
    npm install
    npm run build
    
    # Authenticate (Required once)
    npm run auth
    ```

---

## 1. Clawdbot (The "Hands")

### Local Installation
Copy the `chatshuttle-nexus` folder into your Clawdbot skills directory.
```bash
cp -r chatshuttle-nexus ~/.clawdbot/skills/
```
Clawdbot will automatically detect `SKILL.md` and enable the tool.

### Docker / VPS Installation
If you run Clawdbot via Docker, you must mount the skill folder AND the token storage.

```yaml
# docker-compose.yml
services:
  clawdbot:
    image: clawdbot/clawdbot:latest
    volumes:
      # Mount the Skill Code
      - ./chatshuttle-nexus:/home/node/app/skills/chatshuttle-nexus
      # Mount the Auth Token (so you don't need to re-login inside Docker)
      - ~/.chatshuttle:/home/node/.chatshuttle
```

---

## 2. Claude Code (The "Brain")

Claude Code supports **MCP (Model Context Protocol)**. Since Nexus outputs standard JSON, you can add it as a tool.

### Configuration
Run this command to register Nexus as a tool:

```bash
claude mcp add nexus -- npm start --prefix /absolute/path/to/chatshuttle-nexus/ -- search
```

*Note: You may need to wrap this in a customized MCP server script if strict MCP JSON-RPC compliance is verified. For now, Claude Code often accepts CLI tools that output JSON.*

Alternatively, add to your `~/.claude.json`:
```json
{
  "mcpServers": {
    "nexus": {
      "command": "node",
      "args": ["/absolute/path/to/chatshuttle-nexus/dist/cli.js", "search", "--json"]
    }
  }
}
```

---

## 3. Cursor (The "IDE")

Cursor can consume Nexus via **MCP** or **Custom Commands**.

### Option A: MCP (Recommended)
1.  Go to **Settings > Cursor Settings > MCP**.
2.  Click **Add New MCP Server**.
3.  Name: `ChatShuttle Nexus`
4.  Command: `node /absolute/path/to/chatshuttle-nexus/dist/cli.js search` (Note: Cursor's MCP implementation is evolving, check for Updates).

### Option B: Custom Command (Slash Command)
1.  Create a file `.cursor/rules` (or use Custom Mode).
2.  Add a rule:
    > "When I ask to 'search memory' or 'check history', run the following terminal command and interpret the JSON output: `nexus search 'QUERY' --json`"

---

## 4. Antigravity (The "Agent")

Antigravity automatically respects the `SKILL.md` format found in recognized directories.

1.  Ensure `chatshuttle-nexus` is in a workspace directory.
2.  Instruct Antigravity: "Use the ChatShuttle Nexus skill to finding X."
3.  Antigravity will parse the `SKILL.md`, execute `nexus search --json`, and use the results.

---

## Usage Examples

**Prompt**: "Find the Python script for image resizing I wrote last week."
**Agent Action**: `nexus search "python image resize" --json`
**Output**: 
```json
{ "results": [{ "title": "Image Processing Script", "text": "def resize_image():..." }] }
```
**Agent Response**: "I found the script in your 'Image Processing' chat..."
