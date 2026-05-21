import { NextResponse } from "next/server";
import { getAudit } from "@/lib/audit/store";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audit = await getAudit(slug);
  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  return NextResponse.json(audit);
}
