---
name: Vercel AI SDK peer dependency
description: @opentelemetry/api must be installed explicitly alongside ai + @ai-sdk/openai in api-server
---
**Rule:** When adding `ai` and `@ai-sdk/openai` to api-server, also run `pnpm add @opentelemetry/api --filter @workspace/api-server`.

**Why:** The Vercel AI SDK declares `@opentelemetry/api` as a peer dependency but does not install it automatically. Node.js ESM will throw `ERR_MODULE_NOT_FOUND` for `@opentelemetry/api` at startup even though the build succeeds.

**How to apply:** Any time `ai` or `@ai-sdk/*` are added to a pnpm workspace package, check whether `@opentelemetry/api` is already in node_modules. If not, add it explicitly.
