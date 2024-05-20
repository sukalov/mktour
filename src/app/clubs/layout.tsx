import ClubsNavbar from '@/app/clubs/(components)/clubs-navbar';
import { validateRequest } from '@/lib/auth/lucia';
import { ViewTransitions } from 'next-view-transitions';
import { ReactNode } from 'react';

export default async function ClubsPageLayout({ children }: ClubsPageLayoutProps) {
  const { user } = await validateRequest()
  return (
    <ViewTransitions>
      <ClubsNavbar user={user} />
      <div className="pt-10">{children}</div>
    </ViewTransitions>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
  //   create: ReactNode;
}
