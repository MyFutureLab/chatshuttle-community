# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within ChatShuttle, please do NOT open a public issue.

This project is a Chrome Extension that runs locally in your browser and syncs directly with your Google Drive. We do not maintain any intermediate servers for storing user data.

However, if you find a vulnerability that could compromise user privacy or security (e.g. XSS, token leakage), please email us directly.

**Email:** security@chatshuttle.ai

We will acknowledge your report within 48 hours.

## Data Privacy

ChatShuttle is designed with a "Local First + Personal Cloud" architecture:
- **No Analytics on sensitive data**: We never track your conversation content.
- **Direct Sync**: Data moves directly between your browser and your Google Drive API.
- **Encrypted Locally**: Sensitive access tokens are stored in `chrome.storage.local` and not shared.

For more details, please see our [Privacy Policy](https://chatshuttle.ai/privacy).
