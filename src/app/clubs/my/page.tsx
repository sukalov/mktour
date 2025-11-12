import Dashboard from '@/app/clubs/my/dashboard';
import { clubQueryPrefetch } from '@/app/clubs/my/prefetch';
import { HydrateClient } from '@/components/trpc/server';
import { publicCaller } from '@/server/api';
import { redirect } from 'next/navigation';

export default async function ClubInfo() {
  const user = await publicCaller.user.auth();
  if (!user) redirect('/sign-in?from=/clubs/my');
  clubQueryPrefetch(user.selected_club);

  return (
    <HydrateClient>
      <Dashboard userId={user.id} />
    </HydrateClient>
  );
}
