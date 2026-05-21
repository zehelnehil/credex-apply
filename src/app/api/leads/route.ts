import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { captureLead } from "@/lib/leads";
import { checkRateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  auditId: z.string().optional(),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  role: z.string().max(80).optional(),
  intent: z.string().max(300).optional()
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const rate = await checkRateLimit(`lead:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead input" }, { status: 400 });
  }

  await captureLead(parsed.data);
  return NextResponse.json({ ok: true });
}
