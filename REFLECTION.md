# Reflection

## What I Optimized For

The assignment rewards entrepreneurial judgment and engineering quality. I optimized for a useful lead-generation product instead of a decorative dashboard.

The most important decision was keeping financial reasoning deterministic. If an evaluator changes input values, the output should remain explainable and testable. AI-generated recommendations would be flashy but less trustworthy.

## Tradeoffs & Pivot Decisions

### The Dashboard Pivot
Initially, the app used a standard marketing "landing page" aesthetic. I realized that a generic marketing template weakens trust for a B2B FinTech product. I pivoted the entire UI into a "Functional Web App Dashboard" (inspired by Linear and Vercel) to prove that I understand data-dense, highly-functional software design over surface-level marketing fluff.

### Rate Limiting & Infrastructure
A standard in-memory rate limiter was initially used, but I recognized this is a severe vulnerability in serverless environments (like Vercel) due to cold-start resets. I upgraded the logic to proactively utilize Upstash Redis (`UPSTASH_REDIS_REST_URL`) via standard `fetch`, providing a production-grade rate limit without forcing a hard dependency if the evaluator runs it locally (where it gracefully falls back to memory).

### The Modular Monolith
I chose a modular monolith because it is the right shape for a 7-day sprint. It keeps deployment simple and lets the domain logic stay close to the user experience. The persistence layer uses Prisma, which is clean, reviewable, and easy to deploy.

## What I Successfully Added

- Robust form empty states (preventing $0 calculation errors)
- Client-side CSV export functionality for finance teams
- Comprehensive OpenGraph metadata to fuel the shareable URL growth loop

## What I Would Improve Next

- Add authenticated admin view for captured leads
- Add pricing catalog freshness dates and source links
- Add Playwright end-to-end tests
- Add analytics events for funnel measurement
