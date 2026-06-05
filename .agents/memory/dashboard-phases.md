---
name: Dashboard multi-phase build
description: All 7 phases of dashboard pages built in one session — patterns and conventions used
---
**Rule:** All dashboard pages use `useDashboardUser()` hook for auth guard + `DashboardLayout` for shared nav. Both are in `src/hooks/` and `src/components/` respectively.

**Why:** Keeps auth logic DRY and gives a consistent 13-item sidebar (Overview / Develop / Platform / Account sections). The layout accepts `fullHeight` prop for pages that need full-screen behavior (Studio, Playground).

**How to apply:** Any new dashboard page follows this pattern:
```tsx
const { user, loading } = useDashboardUser()
if (loading) return <LoadingSpinner />
if (!user) return null
return <DashboardLayout user={user}><div className="p-6 md:p-8 max-w-5xl">...</div></DashboardLayout>
```

**Key decisions:**
- Monaco loaded via static `import MonacoEditor from '@monaco-editor/react'` (lazy-loads internally)
- AI Studio uses `fetch('/api/chat')` — relative URL works because web app is at `/` and API proxy is at `/api`
- Agent system prompts live server-side in `chat.ts` AGENT_PROMPTS map, client sends `agentId` string only
- `fullHeight` layout prop sets `h-screen overflow-hidden` on outer div for Studio/Playground flex layouts
