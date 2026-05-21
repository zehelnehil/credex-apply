# Economics

## Audit Philosophy

The product should never exaggerate savings. A credible audit is more valuable than a dramatic number because Credex wants qualified trust, not a one-time gimmick.

## Deterministic Inputs

The engine considers:

- Monthly spend
- Seats
- Team size
- Primary workflow
- Tool category
- Basic benchmark price bands
- Duplicate categories

## Benchmark Logic

Each tool has a starter and team per-seat benchmark. The current implementation uses public, approximate SaaS pricing bands that are easy to review and update. The app does not claim live pricing and does not scrape pricing pages.

For each tool:

```text
benchmark spend = preferred per-seat rate * seats * use-case weight * seat-fit weight
```

Savings are only recommended when the current spend materially exceeds the benchmark, seats exceed team size, or tool category fit is weak for the selected use case.

## Guardrails

- Savings are capped at 55% of current monthly spend.
- Low-savings audits say so directly.
- Recommendations include confidence levels.
- The engine favors seat cleanup before vendor migration because it is less disruptive.

## Example

For a 4-person engineering team paying for 10 ChatGPT Team seats, the strongest recommendation is to remove unused seats. That is more defensible than saying "switch to another model" because the waste is observable from the input.

