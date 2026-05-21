"use client";

import { track } from "@vercel/analytics";
import type { AuditInput, AuditResult as AuditResultType } from "@/lib/audit/types";
import { currency, percent } from "@/lib/utils";

type Props = {
  result: AuditResultType;
  input: AuditInput;
  slug?: string;
  summary?: string;
};

export function AuditResult({ result, input, slug, summary }: Props) {
  const shareUrl = slug ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/a/${slug}` : undefined;

  const downloadCSV = () => {
    track("csv_export_clicked", { recommendationsCount: result.recommendations.length });
    if (!result.recommendations.length) return;
    const headers = ["Severity", "Confidence", "Title", "Monthly Savings", "Rationale"];
    const rows = result.recommendations.map(r => [
      r.severity,
      `${Math.round(r.confidence * 100)}%`,
      `"${r.title.replace(/"/g, '""')}"`,
      r.monthlySavings,
      `"${r.rationale.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `credex_audit_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };


  return (
    <section className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Monthly savings" value={currency(result.estimatedMonthlySavings)} />
        <Metric label="Annual savings" value={currency(result.estimatedAnnualSavings)} />
        <Metric label="Efficiency score" value={`${result.efficiencyScore}/100`} />
        <Metric label="Savings rate" value={percent(result.savingsRate)} />
      </div>

      <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Executive summary</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink tracking-tight">AI spend audit for a {input.teamSize}-person team</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">{summary ?? result.summary}</p>
          </div>
          {shareUrl ? (
            <a
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-medium text-ink hover:bg-mist shadow-sm transition-colors"
              href={shareUrl}
              onClick={() => track("share_url_clicked")}
            >
              Share report
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-ink tracking-tight">Recommended actions</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500 font-medium">{result.recommendations.length} found</span>
              {result.recommendations.length > 0 && (
                <button
                  onClick={downloadCSV}
                  className="text-xs font-semibold text-ink border border-line bg-mist px-2 py-1 rounded hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {result.recommendations.length ? (
              result.recommendations.map((recommendation) => (
                <article key={recommendation.id} className="rounded-lg border border-line bg-mist p-5 transition-shadow hover:shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                          {recommendation.severity}
                        </span>
                        <span className="text-xs font-medium text-zinc-500">{Math.round(recommendation.confidence * 100)}% confidence</span>
                      </div>
                      <h4 className="mt-3 text-lg font-semibold text-ink tracking-tight">{recommendation.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{recommendation.rationale}</p>
                    </div>
                    <div className="shrink-0 rounded-md border border-line bg-white px-4 py-3 text-right shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Monthly impact</p>
                      <p className="mt-1 text-xl font-semibold text-credex-700">{currency(recommendation.monthlySavings)}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-line bg-mist p-5 text-sm text-zinc-600 text-center">
                No material savings were detected. That is a good outcome; the next credible move is usage review, not forced consolidation.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-xl border border-line bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-ink tracking-tight">Spend baseline</h3>
            <div className="mt-5 space-y-4 text-sm">
              <Row label="Current monthly spend" value={currency(result.totalMonthlySpend)} />
              <Row label="Current annual spend" value={currency(result.totalAnnualSpend)} />
              <Row label="Benchmark monthly spend" value={currency(result.benchmarkMonthlySpend)} />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-mist p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-ink tracking-tight">Review notes</h3>
            </div>
            <div className="mt-5 space-y-3">
              {result.flags.length ? (
                result.flags.map((flag) => <p key={flag} className="text-sm leading-relaxed text-zinc-600">{flag}</p>)
              ) : (
                <p className="text-sm leading-relaxed text-zinc-600">No seat-count flags. Validate active usage before changing plans.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-mist p-5 shadow-sm">
      <div className="text-zinc-500 text-xs font-bold tracking-wider uppercase">
        {label}
      </div>
      <p className="mt-3 text-3xl font-semibold text-ink tracking-tight">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-b-0">
      <span className="text-zinc-600">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
