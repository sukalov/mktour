import { Loader2 } from 'lucide-react';

// FIXME intl
export default function Loading() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center">
      <span className="sr-only">Loading...</span>
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}

export const LoadingSpinner = () => (
  <Loader2 className="size-5 animate-spin p-0 -translate-0.5" />
);
