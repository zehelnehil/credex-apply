import Link from "next/link";

export function Navigation() {
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b border-line bg-white px-4 sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center bg-ink text-white text-xs font-bold rounded-sm">
          C
        </div>
        <span className="font-semibold text-ink text-sm tracking-tight">Credex</span>
        <span className="hidden sm:inline text-xs font-medium text-zinc-400 border-l border-line pl-3 ml-1">Spend Auditor</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-zinc-400 hidden sm:block">v1.0 MVP</span>
      </div>
    </header>
  );
}
