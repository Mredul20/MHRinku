export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden bg-primary/15" role="status" aria-label="Loading page">
      <div className="h-full w-1/3 animate-pulse bg-primary" />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
