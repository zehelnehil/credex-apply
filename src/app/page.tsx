import { AuditForm } from "@/components/audit-form";

export default function HomePage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 mb-2">
            <span className="hover:text-ink transition-colors cursor-pointer">Audits</span>
            <span>/</span>
            <span className="text-ink">New Spend Audit</span>
          </div>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">New Spend Audit</h1>
          <p className="mt-1 text-sm text-zinc-500">Calculate defensible savings by benchmarking seat counts and plan fit against the Credex index.</p>
        </div>

        {/* Form Container */}
        <AuditForm />
      </div>
    </main>
  );
}
