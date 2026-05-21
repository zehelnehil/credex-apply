# Tests

## Current Coverage

We have 6 automated tests covering the `runAudit` engine in `src/lib/audit/engine.test.ts`.

To run these tests:
```bash
npm run test
```

### Covered Cases:
1. **finds unused seat savings before vendor swaps:** Verifies the engine identifies over-provisioned seat counts before suggesting tool migrations.
2. **does not manufacture savings when spend is already lean:** Ensures the engine doesn't hallucinate savings for highly optimized startups.
3. **flags overlapping coding assistants for engineering teams:** Verifies it correctly catches when a team pays for both Cursor and GitHub Copilot.
4. **suggests cheaper alternative tools in the same category:** Ensures the engine correctly recommends cheaper tools (e.g., Claude over ChatGPT) based on the pricing catalog.
5. **caps total savings at 55% of monthly spend:** Verifies that our defensible savings cap works, ensuring we don't present unrealistic >80% savings claims.
6. **flags tools that do not match the primary use case:** Ensures we catch misaligned tooling (e.g., expensive coding tools for a primarily sales-focused team).


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

