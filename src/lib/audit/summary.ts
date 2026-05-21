import OpenAI from "openai";
import type { AuditInput, AuditResult } from "./types";

export async function generateSummary(input: AuditInput, result: AuditResult) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return result.summary;

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 170,
      messages: [
        {
          role: "system",
          content: "Write concise, financially defensible SaaS spend audit summaries. Do not invent prices, facts, or savings. Use only provided numbers."
        },
        {
          role: "user",
          content: JSON.stringify({
            teamSize: input.teamSize,
            primaryUseCase: input.primaryUseCase,
            totalMonthlySpend: result.totalMonthlySpend,
            estimatedMonthlySavings: result.estimatedMonthlySavings,
            estimatedAnnualSavings: result.estimatedAnnualSavings,
            recommendations: result.recommendations.map((rec) => ({
              title: rec.title,
              monthlySavings: rec.monthlySavings,
              rationale: rec.rationale
            }))
          })
        }
      ]
    });

    return response.choices[0]?.message.content?.trim() || result.summary;
  } catch {
    return result.summary;
  }
}
