---
name: chatshuttle-nexus
description: Access the user's "Universal Memory" (history from Gemini, Claude, ChatGPT, etc.) via ChatShuttle.
---

# ChatShuttle Nexus

## Description
This skill gives you access to the user's **external brain**. It allows you to search through their past conversations, plans, code snippets, and decisions made in other AI tools (like Gemini Advanced, Claude.ai, or ChatGPT).

**Use this skill when:**
- The user asks about "that project we planned".
- You need to find code snippets the user wrote previously.
- The user references a decision made in the past ("remember what we decided about the auth schema?").
- You are debugging an issue and want to know if the user has solved it before.

## Tools

### `search_memory`
Semantically searches the user's conversation history using a hybrid engine (Vector + Keyword).

- **Parameters**:
  - `query` (string): The search query. Be specific. Convert vague references like "that thing" into searchable keywords (e.g., "React Auth Schema").

- **Usage**:
  - **Linux/Mac**:
    ```bash
    nexus search "{{query}}" --json
    ```
  
- **Output Format**:
  Returns a JSON object with a list of results. Each result contains:
  - `title`: Title of the conversation.
  - `text`: A relevant snippet of the conversation.
  - `score`: Relevance score (higher is better).

## Authentication
If the tool returns an "AUTH_REQUIRED" error, you must ask the user to authenticate.
**Response Template for Auth:**
"I need to connect to your ChatShuttle Memory first. Please run the following command in your terminal to authenticate: `nexus auth`"

## Examples

**User:** "Find the python script I wrote for image resizing."
**Action:**
```bash
nexus search "python script image resize" --json
```

**User:** "What was the error code we saw in the last deployment?"
**Action:**
```bash
nexus search "deployment error code" --json
```
