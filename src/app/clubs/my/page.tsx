import Dashboard from '@/app/clubs/my/dashboard';
import { clubQueryClient, clubQueryPrefetch } from '@/app/clubs/my/prefetch';
import { validateRequest } from '@/lib/auth/lucia';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
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
