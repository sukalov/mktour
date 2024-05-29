import BottomNavigation from '@/components/navbars/bottom-navigation';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navbars/club-dashboard-navbar-items';
import { validateRequest } from '@/lib/auth/lucia';
import { ReactNode } from 'react';

export default async function ClubsPageLayout({
  children,
}: ClubsPageLayoutProps) {
  const { user } = await validateRequest();
  return (
    <div>
      {/* <SubNavbar
        user={user}
        items={clubDashboardNavbarItems}
        root="/club/dashboard/"
  /> */}
      {/* <div className="m-4">{children}</div> */}
      {/* <BottomNavigation
        user={user}
        items={clubDashboardNavbarItems}
        root="/club/dashboard/"
      /> */}
      <BottomNavigation
        user={user}
        items={CLUB_DASHBOARD_NAVBAR_ITEMS}
        root="/club/dashboard/"
      />
      <div className="mx-4 pt-12">{children}</div>
    </div>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
