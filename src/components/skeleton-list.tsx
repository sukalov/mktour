import { Skeleton } from '@/components/ui/skeleton';
import { FC } from 'react';

const SkeletonList: FC<{ length?: number; height?: number }> = ({
  length,
  height,
}) => {
  const list = new Array(length || 4).fill('');
  const h = height ? `h-${height}` : 'h-24';

  return (
    <div>
      <div className="from-background absolute z-10 h-[100svh] w-full bg-linear-to-t"></div>
      <div className="flex flex-col gap-2">
        {list.map((_, i) => (
          <Skeleton key={i} className={`${h} w-full`} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonList;
