import { Skeleton } from '@/components/ui/skeleton';
import { FC } from 'react';

const SkeletonList: FC<{
  length?: number;
  height?: number;
  className?: string;
}> = ({ length, height, className }) => {
  const list = new Array(length || 5).fill('');
  const h = height ? `h-${height}` : 'h-24';

  return (
    <div className="mk-list relative h-full max-h-[60dvh] overflow-hidden">
      <div className="from-background absolute inset-0 w-full bg-linear-to-t" />
      <div className="-z-10 flex flex-col gap-2">
        {list.map((_, i) => (
          <Skeleton key={i} className={`${h} w-full ${className}`} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonList;
