# Tests

## Current Coverage

`src/lib/audit/engine.test.ts` covers:

- Unused seat savings
- Honest low-savings results
- Overlapping coding assistant recommendations

These tests focus on the highest-risk part of the product: financial recommendation logic.

## Manual QA Checklist

- Submit default audit
- Add and remove tools
- Confirm form state survives refresh
- Generate a public report URL
- Submit lead capture
- Visit invalid audit URL
- Test mobile layout
- Run Lighthouse against deployed Vercel URL

## Future Tests

- API route validation
- Lead capture validation
- Public report rendering
- Rate-limit behavior
- Playwright smoke test for the full funnel

