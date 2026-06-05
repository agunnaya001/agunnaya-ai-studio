import { Router } from "express";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const SYSTEM_PROMPT = `You are an AI assistant embedded in Agunnaya AI Studio — a platform for building Web3 applications. You specialize in:
- Solidity smart contracts (ERC-20, ERC-721, ERC-1155, DeFi, DAOs)
- Security best practices (reentrancy guards, access control, overflow protection)
- Blockchain development (Ethereum, Polygon, Arbitrum, Base, Solana)
- Frontend Web3 integration (ethers.js, viem, wagmi, RainbowKit)
- DeFi protocols (AMMs, lending, staking, yield farming)
- NFT and token standards

When writing code:
- Use clear, well-commented Solidity with SPDX license identifiers
- Follow OpenZeppelin patterns where applicable
- Provide TypeScript examples for frontend integration
- Always mention security considerations

Be concise and practical. Format all code in markdown code blocks with language tags.`;

router.post("/chat", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No auth token" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Server misconfigured: missing Supabase env vars" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: messages as Array<{ role: "user" | "assistant" | "system"; content: string }>,
      maxTokens: 2048,
    });

    result.pipeTextStreamToResponse(res);
  } catch (err) {
    console.error("[chat] error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
