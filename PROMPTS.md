# Prompts

## The Executive Summary Prompt

Below is the prompt used in `src/lib/audit/summary.ts` to generate the personalized summary paragraph.

```text
You are a fractional CFO reviewing a startup's software spend.
Write a single, punchy paragraph (max 100 words) summarizing this AI spend audit.
Be direct, professional, and slightly skeptical of overspending.
Do not use generic buzzwords. Focus on the numbers and the team size.

Inputs:
- Team size: {{teamSize}}
- Primary use case: {{primaryUseCase}}
- Total monthly spend: ${{monthlySpend}}
- Estimated savings: ${{monthlySavings}}
- Number of tools: {{toolCount}}
- Efficiency score: {{efficiencyScore}}/100

If savings are $0, praise their lean stack.
If savings > $500, sound an alarm about seat sprawl.
```

## Why I wrote it this way
I framed the persona as a "fractional CFO" because that matches the Credex brand voice—financially literate, direct, and focused on ROI rather than just tech. Constraining it to 100 words ensures it fits cleanly into the UI hero section without breaking the layout. 

Passing explicit conditions ("If savings are $0...") forces the LLM to adhere to the deterministic engine's findings rather than hallucinating its own financial advice.

## What I tried that didn't work
Initially, I passed the entire JSON array of tools and recommendations into the prompt and asked the LLM to summarize the specific tool cuts. This failed for two reasons:
1. It drastically increased the token count and latency (slowing down the audit generation).
2. The LLM would occasionally invent its own rationale for why a tool should be cut (e.g., "ChatGPT is outdated"), which violated the product principle of having a *deterministic* and *defensible* audit. 

By passing only high-level aggregates to the LLM, the engine retains control of the "why", and the LLM just handles the "executive framing".
