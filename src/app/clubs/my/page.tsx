import Dashboard from '@/app/clubs/my/dashboard';
import { validateRequest } from '@/lib/auth/lucia';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { clubQueryClient, clubQueryPrefetch } from 'archive/dashboard/prefetch';
import { redirect } from 'next/navigation';

export default async function ClubInfo() {
  const { user } = await validateRequest();
  if (!user) redirect('/clubs/all/');
  await clubQueryPrefetch(user.id, user.selected_club);

  return (
    <HydrationBoundary state={dehydrate(clubQueryClient)}>
      <Dashboard userId={user.id} />
    </HydrationBoundary>
  );
}
