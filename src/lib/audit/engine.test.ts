import { describe, expect, it } from "vitest";
import { runAudit } from "./engine";
import type { AuditInput } from "./types";

describe("runAudit", () => {
  it("finds unused seat savings before vendor swaps", () => {
    const input: AuditInput = {
      teamSize: 4,
      primaryUseCase: "engineering",
      tools: [{ tool: "ChatGPT", plan: "Team", monthlySpend: 300, seats: 10 }]
    };

    const result = runAudit(input);

    expect(result.estimatedMonthlySavings).toBeGreaterThan(0);
    expect(result.recommendations[0]?.title).toContain("unused");
    expect(result.efficiencyScore).toBeLessThan(90);
  });

  it("does not manufacture savings when spend is already lean", () => {
    const input: AuditInput = {
      teamSize: 3,
      primaryUseCase: "engineering",
      tools: [{ tool: "GitHub Copilot", plan: "Individual", monthlySpend: 30, seats: 3 }]
    };

    const result = runAudit(input);

    expect(result.estimatedMonthlySavings).toBe(0);
    expect(result.recommendations).toHaveLength(0);
    expect(result.summary).toContain("not showing obvious");
  });

  it("flags overlapping coding assistants for engineering teams", () => {
    const input: AuditInput = {
      teamSize: 8,
      primaryUseCase: "engineering",
      tools: [
        { tool: "GitHub Copilot", plan: "Business", monthlySpend: 152, seats: 8 },
        { tool: "Cursor", plan: "Pro", monthlySpend: 160, seats: 8 }
      ]
    };

    const result = runAudit(input);

    expect(result.recommendations.some((rec) => rec.title.includes("coding assistants"))).toBe(true);
  });

  it("suggests cheaper alternative tools in the same category", () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: "engineering",
      tools: [{ tool: "Cursor", plan: "Team", monthlySpend: 200, seats: 5 }]
    };

    const result = runAudit(input);

    const altRec = result.recommendations.find((rec) => rec.title.includes("alternative"));
    expect(altRec).toBeDefined();
    expect(altRec?.affectedTools).toContain("GitHub Copilot");
    expect(altRec?.confidence).toBeLessThan(0.7);
  });

  it("caps total savings at 55% of monthly spend", () => {
    const input: AuditInput = {
      teamSize: 2,
      primaryUseCase: "engineering",
      tools: [
        { tool: "ChatGPT", plan: "Team", monthlySpend: 600, seats: 20 },
        { tool: "Jasper", plan: "Enterprise", monthlySpend: 500, seats: 20 }
      ]
    };

    const result = runAudit(input);
    const maxAllowed = Math.round((600 + 500) * 0.55);

    expect(result.estimatedMonthlySavings).toBeLessThanOrEqual(maxAllowed);
  });

  it("flags tools that do not match the primary use case", () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: "sales",
      tools: [{ tool: "Cursor", plan: "Pro", monthlySpend: 200, seats: 5 }]
    };

    const result = runAudit(input);

    const mismatchRec = result.recommendations.find((rec) => rec.title.includes("may not match"));
    expect(mismatchRec).toBeDefined();
    expect(mismatchRec?.confidence).toBeLessThan(0.8);
  });
});

