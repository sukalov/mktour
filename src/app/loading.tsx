export default function Loading() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center">
      <span className="sr-only">Loading...</span>
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
