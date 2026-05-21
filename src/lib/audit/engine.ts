import { nanoid } from "nanoid";
import { toolBenchmarks, useCaseWeights } from "./catalog";
import type { AuditInput, AuditResult, Recommendation } from "./types";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function benchmarkForTool(input: AuditInput, toolName: string, seats: number) {
  const benchmark = toolBenchmarks[toolName] ?? toolBenchmarks.Other;
  const useCaseWeight = useCaseWeights[input.primaryUseCase][benchmark.category];
  const seatFit = seats <= Math.max(1, Math.ceil(input.teamSize * 0.65)) ? 1 : 0.82;
  const preferredRate = seats >= benchmark.enterpriseThresholdSeats
    ? benchmark.teamMonthlyPerSeat
    : benchmark.starterMonthlyPerSeat;

  return {
    benchmark,
    monthly: preferredRate * seats * useCaseWeight * seatFit,
    preferredRate,
    useCaseWeight,
    seatFit
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const totalMonthlySpend = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
  const benchmarkMonthlySpend = input.tools.reduce((sum, tool) => {
    return sum + benchmarkForTool(input, tool.tool, tool.seats).monthly;
  }, 0);

  const recommendations: Recommendation[] = [];
  const flags: string[] = [];

  for (const tool of input.tools) {
    const { benchmark, monthly, preferredRate, seatFit, useCaseWeight } = benchmarkForTool(input, tool.tool, tool.seats);
    const spendPerSeat = tool.monthlySpend / Math.max(tool.seats, 1);
    const overspend = Math.max(0, tool.monthlySpend - monthly);
    const unusedSeats = Math.max(0, tool.seats - input.teamSize);

    if (unusedSeats > 0) {
      const seatSavings = unusedSeats * spendPerSeat;
      recommendations.push({
        id: nanoid(8),
        severity: "high",
        title: `Remove ${unusedSeats} unused ${tool.tool} seat${unusedSeats === 1 ? "" : "s"}`,
        rationale: `${tool.tool} has more paid seats than the reported team size. Before changing vendors, right-size seat count because it is the least disruptive savings lever.`,
        monthlySavings: Math.round(seatSavings),
        affectedTools: [tool.tool],
        confidence: 0.95
      });
    }

    if (overspend >= 30 && spendPerSeat > preferredRate * 1.2) {
      recommendations.push({
        id: nanoid(8),
        severity: overspend >= 150 ? "high" : "medium",
        title: `Review ${tool.tool} plan level`,
        rationale: `${tool.tool} is running about $${Math.round(spendPerSeat)}/seat against a defensible benchmark near $${Math.round(preferredRate)}/seat for this stage. ${benchmark.notes}`,
        monthlySavings: Math.round(overspend * 0.75),
        affectedTools: [tool.tool],
        confidence: 0.82
      });
    }

    if (seatFit < 1) {
      flags.push(`${tool.tool} appears broadly assigned; verify active usage before renewal.`);
    }

    if (useCaseWeight < 0.6 && tool.monthlySpend > 50) {
      recommendations.push({
        id: nanoid(8),
        severity: "medium",
        title: `${tool.tool} may not match the primary workflow`,
        rationale: `For a team primarily focused on ${input.primaryUseCase}, ${tool.tool}'s category has a weaker fit. Keep it only for named power users with clear recurring usage.`,
        monthlySavings: Math.round(tool.monthlySpend * 0.25),
        affectedTools: [tool.tool],
        confidence: 0.68
      });
    }
  }

  const codingTools = input.tools.filter((tool) => ["GitHub Copilot", "Cursor"].includes(tool.tool));
  if (codingTools.length > 1 && input.primaryUseCase === "engineering") {
    const duplicateSpend = codingTools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
    recommendations.push({
      id: nanoid(8),
      severity: "medium",
      title: "Consolidate overlapping coding assistants",
      rationale: "Engineering teams can justify one primary coding assistant per active developer. Running both Cursor and Copilot can be valuable for power users, but defaulting every engineer into both usually weakens ROI.",
      monthlySavings: Math.round(duplicateSpend * 0.2),
      affectedTools: codingTools.map((tool) => tool.tool),
      confidence: 0.7
    });
  }

  const assistantTools = input.tools.filter((tool) => ["ChatGPT", "Claude", "Perplexity"].includes(tool.tool));
  if (assistantTools.length >= 3) {
    const assistantSpend = assistantTools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
    recommendations.push({
      id: nanoid(8),
      severity: "medium",
      title: "Rationalize general AI subscriptions",
      rationale: "Three or more general-purpose AI subscriptions create avoidable overlap. Keep breadth for founders or research-heavy roles, but standardize the default team plan.",
      monthlySavings: Math.round(assistantSpend * 0.18),
      affectedTools: assistantTools.map((tool) => tool.tool),
      confidence: 0.72
    });
  }

  // Alternative tool suggestions: find cheaper tools in the same category
  const userToolNames = new Set(input.tools.map((t) => t.tool));
  for (const tool of input.tools) {
    const currentBenchmark = toolBenchmarks[tool.tool] ?? toolBenchmarks.Other;
    const spendPerSeat = tool.monthlySpend / Math.max(tool.seats, 1);

    // Find all catalog tools in the same category that the user is NOT already using
    const alternatives = Object.entries(toolBenchmarks)
      .filter(([name, alt]) =>
        alt.category === currentBenchmark.category &&
        name !== tool.tool &&
        name !== "Other" &&
        !userToolNames.has(name as typeof tool.tool) &&
        alt.starterMonthlyPerSeat < spendPerSeat * 0.7 // must be meaningfully cheaper
      )
      .sort((a, b) => a[1].starterMonthlyPerSeat - b[1].starterMonthlyPerSeat);

    if (alternatives.length > 0 && spendPerSeat > 25) {
      const [altName, altBenchmark] = alternatives[0];
      const potentialSavings = Math.round((spendPerSeat - altBenchmark.starterMonthlyPerSeat) * tool.seats);
      if (potentialSavings > 20) {
        recommendations.push({
          id: nanoid(8),
          severity: "low",
          title: `Consider ${altName} as an alternative to ${tool.tool}`,
          rationale: `${altName} offers similar ${currentBenchmark.category} capabilities at ~$${altBenchmark.starterMonthlyPerSeat}/seat vs your current ~$${Math.round(spendPerSeat)}/seat on ${tool.tool}. ${altBenchmark.notes} Switching involves workflow migration risk, so evaluate with a small pilot first.`,
          monthlySavings: Math.round(potentialSavings * 0.5), // discount for migration risk
          affectedTools: [tool.tool, altName],
          confidence: 0.55
        });
      }
    }
  }

  const uniqueRecommendations = dedupeRecommendations(recommendations)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 6);

  const estimatedMonthlySavings = Math.min(
    Math.round(uniqueRecommendations.reduce((sum, rec) => sum + rec.monthlySavings, 0)),
    Math.round(totalMonthlySpend * 0.55)
  );
  const savingsRate = totalMonthlySpend === 0 ? 0 : estimatedMonthlySavings / totalMonthlySpend;
  const efficiencyScore = clamp(Math.round(100 - savingsRate * 100 - Math.max(0, totalMonthlySpend - benchmarkMonthlySpend) / Math.max(totalMonthlySpend, 1) * 35), 12, 96);

  const summary = buildDeterministicSummary(input, {
    totalMonthlySpend,
    estimatedMonthlySavings,
    savingsRate,
    recommendationCount: uniqueRecommendations.length
  });

  return {
    totalMonthlySpend: Math.round(totalMonthlySpend),
    totalAnnualSpend: Math.round(totalMonthlySpend * 12),
    estimatedMonthlySavings,
    estimatedAnnualSavings: estimatedMonthlySavings * 12,
    savingsRate,
    efficiencyScore,
    benchmarkMonthlySpend: Math.round(benchmarkMonthlySpend),
    recommendations: uniqueRecommendations,
    flags,
    summary
  };
}

function dedupeRecommendations(recommendations: Recommendation[]) {
  const seen = new Set<string>();
  return recommendations.filter((recommendation) => {
    const key = `${recommendation.title}:${recommendation.affectedTools.join(",")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return recommendation.monthlySavings > 0;
  });
}

function buildDeterministicSummary(
  input: AuditInput,
  result: Pick<AuditResult, "totalMonthlySpend" | "estimatedMonthlySavings" | "savingsRate"> & { recommendationCount: number }
) {
  if (result.estimatedMonthlySavings < 25) {
    return `Your ${input.teamSize}-person team is not showing obvious AI spend leakage. The best next step is lightweight usage review before renewal rather than aggressive tool consolidation.`;
  }

  return `Your ${input.teamSize}-person ${input.primaryUseCase} team is spending about $${result.totalMonthlySpend}/month on AI tools. The audit found ${result.recommendationCount} practical optimization ${result.recommendationCount === 1 ? "move" : "moves"} worth roughly $${result.estimatedMonthlySavings}/month without assuming a risky workflow migration.`;
}
