import ClubSelect from '@/app/club/dashboard/club-select';
import {
  clubQueryClient,
  clubQueryPrefetch,
} from '@/app/club/dashboard/prefetch';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navbars/club-dashboard-navbar-items';
import SubNavbar from '@/components/navbars/subnavbar';
import { validateRequest } from '@/lib/auth/lucia';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function ClubsPageLayout({
  children,
}: ClubsPageLayoutProps) {
  const { user } = await validateRequest();
  if (!user) redirect('/club/all/');
  await clubQueryPrefetch(user.id, user.selected_club);
  return (
    <HydrationBoundary state={dehydrate(clubQueryClient)}>
      <SubNavbar items={CLUB_DASHBOARD_NAVBAR_ITEMS} root="/club/dashboard/" />
      <div className="mx-2 pt-12">
        <ClubSelect userId={user.id} />
        <div className="pt-2 p-2">{children}</div>
      </div>
    </HydrationBoundary>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
}
