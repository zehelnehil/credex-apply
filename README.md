# Credex Spend Auditor

A production-minded MVP for the Credex Web Development Intern Assignment. The app audits startup AI tooling spend, returns deterministic savings recommendations, captures qualified leads, and creates shareable public audit reports.

## Why This Product

AI tools spread quickly inside startups because the unit price feels small: $10 to $40 per seat. The real leakage appears when every role gets every tool, coding assistants overlap, old seats stay active, and team plans are purchased before controls are needed.

Credex can use this as a lead-generation wedge: give founders a useful audit first, then invite them into a renewal and consolidation conversation.

## Features

- Deterministic audit engine for plan fit, seat count, workflow relevance, and duplicate categories
- Functional B2B SaaS dashboard UI (clean, data-dense)
- Client-side CSV export of savings recommendations
- Optional AI-generated summary with deterministic fallback
- Public shareable audit URLs with OpenGraph metadata
- Lead capture after value delivery
- Local form persistence
- Prisma schema for Supabase Postgres
- Serverless-ready rate limiting (Redis + Memory fallback)
- Vitest coverage for core audit logic
- GitHub Actions CI

## Decisions (5 Key Trade-offs)

1. **Deterministic Engine vs. AI-driven Engine:** I chose to hardcode the financial logic in TypeScript rather than passing the raw data to an LLM. Trade-off: It required maintaining `catalog.ts`, but it ensures the outputs are 100% testable, consistent, and defensible to finance teams. AI is only used to format the summary paragraph.
2. **Dashboard UI vs. Marketing Landing Page:** I pivoted the design midway from a standard marketing page to a "Functional Web App Dashboard". Trade-off: It took more time to build robust layouts, but it establishes immediate B2B trust by looking like a premium internal tool (like Linear/Vercel) rather than a lead-gen trap.
3. **Modular Monolith vs. Microservices:** I chose a Next.js App Router monolith over a separate React SPA + Node.js API. Trade-off: Slightly tighter coupling between frontend and backend, but vastly superior shipping speed and simplified deployment for a 7-day sprint.
4. **Upstash Redis vs. Next.js Rate Limiting:** I used Upstash Redis over Next.js's experimental rate limiters or an in-memory map. Trade-off: Added an external dependency, but it guarantees rate-limiting survives serverless cold starts on Vercel without wiping the cache.
5. **Client-side CSV Export vs. Server-side PDF Generation:** I opted for a simple client-side Blob generation for CSVs instead of a heavy server-side PDF generator (like Puppeteer). Trade-off: Less visually impressive than a branded PDF, but provides immediate utility for ops teams who just want the data in Excel, while keeping the server lightweight.

## Deployment & Demo

- **Live URL:** [Insert Vercel URL Here]
- **Demo Video:** [Insert YouTube/Loom Link Here]

### Screenshots
*(Add 3+ screenshots of the dashboard, mobile view, and shareable report here)*


## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma with Supabase Postgres
- Upstash Redis for rate limiting
- Resend for lead notifications
- OpenAI for optional summary wording only
- Vitest
- Vercel

## Local Setup

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

For local database-backed persistence, set `DATABASE_URL` to a Supabase or local Postgres URL and run:

```bash
npx prisma db push
```

If the database is not configured, the app still works in development through an in-memory fallback. Public report links will only survive process restarts when the database is connected.

## Environment Variables

| Name | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Production yes | Supabase Postgres connection string |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL for share links and metadata |
| `UPSTASH_REDIS_REST_URL` | Optional | Serverless rate-limiting endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Serverless rate-limiting token |
| `OPENAI_API_KEY` | Optional | Generates personalized summary copy |
| `RESEND_API_KEY` | Optional | Sends lead notification emails |
| `LEAD_NOTIFY_EMAIL` | Optional | Destination for lead notifications |
| `RATE_LIMIT_MAX` | Optional | Request cap per window |
| `RATE_LIMIT_WINDOW_SECONDS` | Optional | Rate-limit window |

## Quality Checks

```bash
npm run typecheck
npm run test
npm run build
```

