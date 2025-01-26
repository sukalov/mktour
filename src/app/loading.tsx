import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// FIXME intl
export default function Loading() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] w-full flex-auto items-center justify-center">
      <span className="sr-only">Loading...</span>
      <LoadingSpinner />
    </div>
  );
}

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <Loader2
    className={cn(`size-5 -translate-0.5 animate-spin p-0`, className)}
  />
);
