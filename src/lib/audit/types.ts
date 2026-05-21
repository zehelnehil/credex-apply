import { z } from "zod";

export const aiTools = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API direct",
  "OpenAI API direct",
  "Gemini",
  "Windsurf",
  "Other"
] as const;

export const useCases = [
  "engineering",
  "sales",
  "marketing",
  "support",
  "operations",
  "mixed"
] as const;

export const auditToolSchema = z.object({
  tool: z.enum(aiTools),
  plan: z.string().min(1).max(80),
  monthlySpend: z.number().min(0).max(250000),
  seats: z.number().int().min(1).max(5000),
  notes: z.string().max(300).optional()
});

export const auditInputSchema = z.object({
  teamSize: z.number().int().min(1).max(5000),
  primaryUseCase: z.enum(useCases),
  tools: z.array(auditToolSchema).min(1).max(20),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().max(120).optional()
});

export type AuditToolInput = z.infer<typeof auditToolSchema>;
export type AuditInput = z.infer<typeof auditInputSchema>;

export type RecommendationSeverity = "high" | "medium" | "low" | "info";

export type Recommendation = {
  id: string;
  severity: RecommendationSeverity;
  title: string;
  rationale: string;
  monthlySavings: number;
  affectedTools: string[];
  confidence: number;
};

export type AuditResult = {
  totalMonthlySpend: number;
  totalAnnualSpend: number;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  savingsRate: number;
  efficiencyScore: number;
  benchmarkMonthlySpend: number;
  recommendations: Recommendation[];
  flags: string[];
  summary: string;
};
