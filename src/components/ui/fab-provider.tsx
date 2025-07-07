import { Status } from '@/server/queries/get-status-in-tournament';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { createPortal } from 'react-dom';

const FabProvider: FC<FabProviderProps> = ({
  status,
  fabContent,
  scrolling,
}) => {
  if (status !== 'organizer') return null;
  return createPortal(
    <div
      className={`${scrolling && 'opacity-50'} transition-all duration-300 ease-linear`}
    >
      {fabContent}
    </div>,
    document.body,
  );
};

type FabProviderProps = PropsWithChildren & {
  status: Status;
  fabContent: ReactNode;
  scrolling?: boolean;
};

export default FabProvider;
