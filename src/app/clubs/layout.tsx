import { FC, PropsWithChildren } from 'react';

const ClubsLayout: FC<PropsWithChildren> = async ({ children }) => (
  <div className="mb-16 border-2 border-red-500">{children}</div>
);

export default ClubsLayout