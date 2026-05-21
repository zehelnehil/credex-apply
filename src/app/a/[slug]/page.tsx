import { notFound } from "next/navigation";
import Link from "next/link";
import { AuditResult } from "@/components/audit-result";
import { LeadCapture } from "@/components/lead-capture";
import { getAudit } from "@/lib/audit/store";

export default async function PublicAuditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audit = await getAudit(slug);
  if (!audit) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-credex-700">Public audit report</p>
          <h1 className="mt-2 text-4xl font-black text-ink">AI spend audit</h1>
          <p className="mt-2 text-sm text-gray-500">Generated {new Date(audit.createdAt).toLocaleDateString("en-US")}</p>
        </div>
        <Link className="text-sm font-semibold text-credex-700" href="/">Run another audit</Link>
      </header>
      <AuditResult result={audit.result} input={audit.input} slug={audit.slug} summary={audit.summary} />
      <div className="mt-8">
        <LeadCapture auditId={audit.slug} />
      </div>
    </main>
  );
}
