import { Skeleton } from '@/components/ui/skeleton';
import { FC } from 'react';

const SkeletonList: FC<{ length?: number }> = ({ length }) => {
  const list = new Array(length || 4).fill('');

  return (
    <div>
      <div className="absolute z-10 h-[100svh] w-full bg-gradient-to-t from-background"></div>
      <div className="flex flex-col gap-2">
        {list.map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full" />
        ))}
      </div>
    </div>
  );
};

export default SkeletonList;
