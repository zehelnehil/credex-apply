import { NextResponse, type NextRequest } from "next/server";
import { auditInputSchema } from "@/lib/audit/types";
import { runAudit } from "@/lib/audit/engine";
import { generateSummary } from "@/lib/audit/summary";
import { saveAudit } from "@/lib/audit/store";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const rate = await checkRateLimit(`audit:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many audits. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = auditInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid audit input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const deterministic = runAudit(parsed.data);
  const summary = await generateSummary(parsed.data, deterministic);
  const saved = await saveAudit(parsed.data, deterministic, summary);

  return NextResponse.json(saved, {
    headers: {
      "x-ratelimit-remaining": String(rate.remaining)
    }
  });
}
