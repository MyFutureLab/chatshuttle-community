# ChatShuttle: New AI, Same Thread.

[![Install Chrome Extension](https://img.shields.io/badge/Chrome_Web_Store-Install_Free-blue?style=for-the-badge&logo=googlechrome)](https://chrome.google.com/webstore/detail/ogjcfapagafodejpadpopimhhmcdhnpa)
[![Buy Pro](https://img.shields.io/badge/Lemon_Squeezy-Buy_Pro-FDBF11?style=for-the-badge&logo=lemonsqueezy)](https://chatshuttle.lemonsqueezy.com/checkout/buy/73fa87ff-cf48-49a4-9ede-3c4c2f806f95?checkout%5Bdiscount_code%5D=40OFF)

> **Shuttle your full AI chat history (text + images) across web AIs. Keep chatting, not starting over.**

![ChatShuttle Demo](/assets/demo.gif)

## What is ChatShuttle?

ChatShuttle is a Chrome Extension that helps you move a **full chat** into a new chat — **with images**, not just a summary. 

Most tools are summary-only or plain text. ChatShuttle keeps images and context structure intact, so you can continue your workflow seamlessly in Gemini, Claude, or ChatGPT.

### Key Features
- **Universal Import**: Import `ChatGPT Export ZIP` or `Claude Export` (JSON).
- **Keeps Images**: Preserves screenshots and photos in your chat context.
- **Multi-target Restore**: One-click restore in **Gemini**, **Claude**, or **ChatGPT**.
- **Privacy First**: Syncs to *your* Google Drive. No middle server.

## Installation

1. **[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/ogjcfapagafodejpadpopimhhmcdhnpa)** (Recommended)
2. Open the side panel and sign in with Google Drive.
3. Import your first chat export!

## Usage Guide

### 1. Export
Export your history from ChatGPT (`Settings` -> `Data controls` -> `Export data`) or Claude (`Account` -> `Export data`).

### 2. Import
Drag and drop the ZIP (ChatGPT) or JSON (Claude) into ChatShuttle's side panel.

### 3. Restore
Open Gemini, Claude, or ChatGPT. Click the "Restore" button on any chat in ChatShuttle.

---

## 🧠 ChatShuttle Nexus — AI Agent Memory Bridge

> **Status: ⏳ Pending Google OAuth Approval** — Manual workaround available!

**Give your local AI agents access to your web chat history.**

Nexus is a standalone **Skill/Tool** that bridges your **Web AI conversations** (synced by the Extension) to local AI coding assistants like Claude Code, Cursor, and Antigravity.

### Why Use Nexus?

| Feature | Description |
|---------|-------------|
| 🧠 **Long-Term Memory** | Stop repeating context. Let your Agent search past conversations. |
| 🔍 **Universal Search** | One command to search across Gemini, ChatGPT, and Claude history. |
| 🔌 **Native Compatibility** | Works with Claude Code (MCP), Cursor, Antigravity, Clawdbot. |
| ⚡ **Hybrid Search** | Combines vector embeddings + keyword matching for best results. |

### Quick Start

```bash
git clone https://github.com/MyFutureLab/chatshuttle-community.git
cd chatshuttle-community/chatshuttle-nexus
npm install && npm run build
npm run auth   # Or use manual setup during approval period
```

👉 **[Full Nexus Documentation](./chatshuttle-nexus/README.md)**

---

## Roadmap & Support

- [x] ChatGPT Export Import (ZIP)
- [x] Claude Export Import (JSON)
- [x] Restore to Gemini / Claude / ChatGPT
- [x] **Nexus Skill for AI Agents** *(New!)*
- [ ] Improved attachment handling
- [ ] More AI platform support

### Feedback
- **Found a bug?** [Open an Issue](https://github.com/MyFutureLab/chatshuttle-community/issues/new?template=bug_report.md)
- **Have an idea?** [Request a Feature](https://github.com/MyFutureLab/chatshuttle-community/issues/new?template=feature_request.md)

---

## Privacy

- **Your Data**: Stored in **your** Google Drive.
- **Local Index**: Search index is built and stored locally.
- **No Access**: We (the developers) never see your conversations.

[Full Privacy Policy](https://chatshuttle.ai/privacy)
