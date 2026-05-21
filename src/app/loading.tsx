export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-ink"></div>
        <p className="text-sm font-medium text-zinc-500">Loading...</p>
      </div>
    </main>
  );
}
