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

