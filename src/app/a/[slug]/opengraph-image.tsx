import { ImageResponse } from "next/og";
import { getAudit } from "@/lib/audit/store";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audit = await getAudit(slug);
  const savings = audit?.result.estimatedAnnualSavings ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#F6F7F9",
          color: "#111827",
          fontFamily: "Inter"
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700 }}>Credex Spend Auditor</div>
        <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: 0 }}>
          ${savings.toLocaleString("en-US")} annual savings found
        </div>
        <div style={{ fontSize: 30, color: "#087A5A" }}>Deterministic SaaS spend analysis for startup teams</div>
      </div>
    ),
    size
  );
}
