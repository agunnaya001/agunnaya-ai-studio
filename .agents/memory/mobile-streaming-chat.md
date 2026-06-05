---
name: Mobile streaming chat pattern
description: How to stream OpenAI responses from Express to Expo mobile (web preview + native)
---
**Rule:** Use `streamText(...).pipeTextStreamToResponse(res)` on the Express side. On mobile, read with `response.body.getReader()` + `TextDecoder` chunks, accumulating into a string and calling setState on each chunk.

**Why:** `pipeTextStreamToResponse` sends plain text chunks (no SSE wrapping). This is simpler to parse on the client than SSE.

**How to apply:** For native iOS/Android Expo Go, import `fetch` from `expo/fetch` which supports `getReader()`. For web preview, the browser's native fetch works fine. Always provide a fallback: `if (response.body) { streaming } else { await response.text() }`.
