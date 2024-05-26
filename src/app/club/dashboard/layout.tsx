import { clubDashboardNavbarItems } from '@/components/navbars/club-dashboard-navbar-items';
import SubNavbar from '@/components/navbars/subnavbar';
import { validateRequest } from '@/lib/auth/lucia';
import { ReactNode } from 'react';

export default async function ClubsPageLayout({
  children,
}: ClubsPageLayoutProps) {
  const { user } = await validateRequest();
  return (
    <>
      <SubNavbar
        user={user}
        items={clubDashboardNavbarItems}
        root="/club/dashboard/"
      />
      <div className="pt-12">{children}</div>
    </>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
