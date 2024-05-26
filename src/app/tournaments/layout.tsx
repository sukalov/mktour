import SubNavbar from '@/components/navbars/subnavbar';
import { tournamentsNavbarItems } from '@/components/navbars/tournaments-navbar-items';
import { validateRequest } from '@/lib/auth/lucia';
import type { ReactNode } from 'react';

export default async function TournamentsPageLayout({
  children,
}: ClubsPageLayoutProps) {
  const { user } = await validateRequest();
  return (
    <div>
      <SubNavbar
        user={user}
        items={tournamentsNavbarItems}
        root="/tournaments/"
      />
      <div className="pt-12">{children}</div>
    </div>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
