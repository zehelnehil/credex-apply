"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-500">Error</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          An unexpected error occurred. This has been logged and we are looking into it.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-ink px-5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
