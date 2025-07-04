import { Status } from '@/server/queries/get-status-in-tournament';
import { FC, ReactNode, RefObject, useEffect, useState } from 'react';

const FabProvider: FC<FabProviderProps> = ({
  status,
  fabContent,
  viewportRef: ref,
}) => {
  const [scrolling, setScrolling] = useState(false);
  const element = ref?.current || window;

  console.log(element);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setScrolling(false), 300);
    };

    element?.addEventListener('scroll', handleScroll);

    return () => {
      element?.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [element]);

  if (status !== 'organizer') return null;
  return (
    <div
      className={`${scrolling && 'opacity-50'} transition-all duration-300 ease-linear`}
    >
      {fabContent}
    </div>
  );
};

type FabProviderProps = {
  status: Status;
  fabContent: ReactNode;
  viewportRef?: RefObject<HTMLDivElement | null>;
};

export default FabProvider;
