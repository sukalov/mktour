import SubNavbar from '@/components/navbars/subnavbar';
import { tournamentsNavbarItems } from '@/components/navbars/tournaments-navbar-items';
import { validateRequest } from '@/lib/auth/lucia';
import type { ReactNode } from 'react';

export default async function TournamentsPageLayout({
  children,
}: ClubsPageLayoutProps) {
  const { user } = await validateRequest();
  const tournamentsNavbarFixed = tournamentsNavbarItems.map((el) => ({
    ...el,
    path: String(el.path.split('/').at(-1)),
  }));
  return (
    <div>
      <SubNavbar
        user={user}
        items={tournamentsNavbarFixed}
        root="/tournaments/"
      />
      <div className="pt-12">{children}</div>
    </div>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
