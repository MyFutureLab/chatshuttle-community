# Privacy Policy for ChatShuttle Nexus
**Effective Date:** January 28, 2026

## Introduction
ChatShuttle Nexus ("Nexus") is an open-source Desktop Skill designed to work as a companion to the ChatShuttle Chrome Extension. This policy specifically covers the privacy practices of the Nexus application.

## TL;DR — Your Data Stays Yours
- Your chat data is downloaded from your Google Drive
- Index and cache stay on your local computer
- We do not have a server that stores your data

## 1. Data Collection
This application (ChatShuttle Nexus) accesses Google User Data to provide its core functionality. Specifically, we access:
- **Google Drive Files**: We access only the files and folders within the `ChatShuttle_Memories` folder (specifically `index.voy` and `metadata.json`). We do not index, read, or process any other personal files in your Google Drive.
- **Google User Identity**: We access your email address solely to verify your account identity during the OAuth login process.

### Disclosure on `drive.readonly` Scope
Unlike our browser extension which creates files, this Desktop application acts as a "Reader" for your existing archives. To read these specific files created by another client, Google requires the `https://www.googleapis.com/auth/drive.readonly` scope.
**Important**: Although this scope technically allows read access to your Drive, our codebase is strictly programmed to filter and access **ONLY** the `ChatShuttle_Memories` folder.

## 2. Data Usage
How we use, process, and handle the Google User Data we access:

### To Sync Your Memory Index
We use the Google Drive API to download the search index (`index.voy`) and metadata files (`metadata.json`) from your cloud archive to your local machine. This allows you to perform fast, offline searches of your chat history.

### Local Processing Only
All data processing (vector search, keyword matching, result ranking) happens locally on your computer's CPU/memory. We do not send your chat content or search queries to any external server.

## 3. Data Storage
Your data is stored in two locations:
- **Google Drive (Cloud)**: Your master archive remains in your own Google Drive.
- **Local Device (Cache)**: A temporary copy of the search index is stored in your local user directory (`~/.chatshuttle/cache`) for performance. This data never leaves your device.

We do NOT operate a database that stores your chat content or personal information.

## 4. Data Protection
We employ industry-standard security measures to protect your information:
- **Encryption in Transit**: All data transferred between Google Drive servers and your local machine is encrypted using Transport Layer Security (HTTPS/TLS).
- **Local Security**: Detailed chat history is stored only on your local file system, protected by your operating system's user permissions. We do not maintain any external databases of your sensitive information.

## 5. Data Retention and Deletion
You retain full control over your data lifecycle:
- **Retention**: Local cache files exist on your device only as long as you use the application. The master copies in Google Drive are retained according to your own Google Drive settings.
- **Deletion**: You can delete the local data at any time by manually removing the cache folder (`~/.chatshuttle`) on your computer. You can also delete the master archives in Google Drive by removing the `ChatShuttle_Memories` folder.

## 6. Data Sharing
We do not sell, trade, or share your Google User Data with third parties.
There are no third-party services involved in the core search loop of this application.

## 7. AI Training
We do NOT use your data to train AI models. Your conversations remain private and are only formatted for your own personal use with local AI agents.

## Contact
Questions about privacy? Email us at [privacy@chatshuttle.ai](mailto:privacy@chatshuttle.ai)
