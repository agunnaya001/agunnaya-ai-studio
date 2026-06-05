---
name: Supabase JWT verify in api-server
description: Pattern for verifying a Supabase mobile session JWT in the Express API server
---
**Rule:** In api-server, verify mobile session tokens with `createClient(supabaseUrl, supabaseKey).auth.getUser(token)`. Use `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (server-side secrets, already in environment).

**Why:** The mobile client sends `Authorization: Bearer <session.access_token>` from `supabase.auth.getSession()`. The anon key is sufficient to verify JWTs — no service role key needed.

**How to apply:** Fallback to `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY` with `??` if the VITE_ vars are absent.
