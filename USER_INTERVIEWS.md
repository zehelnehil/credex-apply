# User Interviews

These notes reflect three conversations with potential target users (startup founders and engineering managers) to validate the "AI Spend Auditor" thesis.

## Interview 1: "S.B.", Series A Engineering Manager
- **Role:** Head of Engineering
- **Company Stage:** Series A (~45 employees)

### Quotes
1. *"I know we are paying for Copilot for the whole engineering team, but I also know half the team put ChatGPT Plus on their corporate cards. I don't want to play bad cop, but it adds up."*
2. *"If you tell me to switch everyone from Claude to ChatGPT to save $10 a seat, I'll ignore you. The disruption cost is way higher than the software cost."*
3. *"I honestly have no idea what the baseline should be. Is $200 a month per developer normal now?"*

### Most Surprising Thing
He cared way more about "unused seats" than "finding cheaper tools". He assumed tool consolidation was a nightmare, but revoking access for inactive seats was easy money.

### What it changed about the design
I completely changed the audit engine logic to prioritize "unused seats" and "downgrading overkill plans" as the highest-confidence recommendations, and gave "alternative tool suggestions" a lower confidence score because of migration friction.

---

## Interview 2: "M.T.", Seed Founder
- **Role:** Solo Technical Founder
- **Company Stage:** Seed (~5 employees)

### Quotes
1. *"I pay for Claude, ChatGPT, Midjourney, and Perplexity out of pocket. It's like $100 a month. Honestly, I don't care. It's my lowest expense."*
2. *"I wouldn't run this audit for myself, but I would definitely run it for my contractors if I was paying their software licenses."*
3. *"The landing page you showed me looks like a generic SaaS template. If I'm trusting a tool with my financial data, I want it to look like a serious financial dashboard, not a marketing page."*

### Most Surprising Thing
The outright rejection of the initial landing page design. He equated "marketing page aesthetics" with "untrustworthy".

### What it changed about the design
This was the primary driver for the mid-week UI pivot. I completely scrapped the marketing-style landing page and built a "Functional Web App Dashboard" (similar to Linear or Vercel's dashboards) to signal data density, seriousness, and engineering quality.

---

## Interview 3: "A.R.", Operations Lead
- **Role:** VP of Operations
- **Company Stage:** Series B (~120 employees)

### Quotes
1. *"The problem isn't knowing what we spend, the problem is convincing department heads to cut it. I need something I can screenshot and put in a Slack channel."*
2. *"If an AI tells me we should cut something, I'll assume it's hallucinating. If a spreadsheet tells me, I'll believe it."*
3. *"We're paying for Enterprise tiers mostly for SOC2 compliance, not because we need the extra features."*

### Most Surprising Thing
The absolute demand for deterministic math. She did not want an LLM guessing at her financials.

### What it changed about the design
This solidified the core architectural decision: the financial engine must be 100% deterministic TypeScript logic. The AI is *only* allowed to rewrite the summary paragraph, and is completely blocked from modifying the actual recommendation math or savings calculations. I also added a "CSV Export" button specifically because she mentioned needing to share the raw data with department heads.
