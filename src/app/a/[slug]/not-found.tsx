import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-credex-700">Audit not found</p>
      <h1 className="mt-2 text-3xl font-black text-ink">This report is unavailable.</h1>
      <p className="mt-3 text-gray-600">The link may be incorrect, or the audit may not be persisted in this environment.</p>
      <Link className="mt-6 font-semibold text-credex-700" href="/">Run a new audit</Link>
    </main>
  );
}
