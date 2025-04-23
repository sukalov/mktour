import { FC, PropsWithChildren } from 'react';

const ClubsLayout: FC<PropsWithChildren> = async ({ children }) => (
  <div className="pb-16">{children}</div>
);

export default ClubsLayout;
