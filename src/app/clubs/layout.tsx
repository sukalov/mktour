import ClubsNavbar from '@/components/clubs/clubs-navbar';
import { validateRequest } from '@/lib/auth/lucia';
import { ViewTransitions } from 'next-view-transitions';
import { ReactNode } from 'react';

export default async function ClubsPageLayout({ children, id }: ClubsPageLayoutProps) {
  const { user } = await validateRequest()
  return (
    <ViewTransitions>
      <ClubsNavbar user={user} />
      <div className="pt-10">{children}</div>
      <div className="pt-10">{id}</div>
    </ViewTransitions>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
  id: ReactNode
  //   create: ReactNode;
}
