import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          The page you are looking for does not exist or the audit report has expired.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          Run a new audit
        </Link>
      </div>
    </main>
  );
}
