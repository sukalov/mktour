// import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navigation/club-dashboard-navbar-items';
// import { validateRequest } from '@/lib/auth/lucia';
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// import ClubSelect from 'archive/dashboard/club-select';
// import { clubQueryClient, clubQueryPrefetch } from 'archive/dashboard/prefetch';
// import { redirect } from 'next/navigation';
// import { ReactNode } from 'react';

// export default async function ClubsPageLayout({
//   children,
// }: ClubsPageLayoutProps) {
//   const { user } = await validateRequest();
//   if (!user) redirect('/clubs/all/');
//   await clubQueryPrefetch(user.id, user.selected_club);
//   return (
//     <HydrationBoundary state={dehydrate(clubQueryClient)}>
//       <SubNavbar items={CLUB_DASHBOARD_NAVBAR_ITEMS} root="/club/dashboard/" />
//       <div className="pt-12">
//         <div className="px-1">
//           <ClubSelect userId={user.id} />
//         </div>
//         <div className="p-2 pt-2">{children}</div>
//       </div>
//     </HydrationBoundary>
//   );
// }

// interface ClubsPageLayoutProps {
//   children: ReactNode;
// }
