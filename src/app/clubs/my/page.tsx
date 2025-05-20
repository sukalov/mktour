import Dashboard from '@/app/clubs/my/dashboard';
import { clubQueryPrefetch } from '@/app/clubs/my/prefetch';
import { HydrateClient } from '@/components/trpc/server';
import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function ClubInfo() {
  const { user } = await validateRequest();
  if (!user) redirect('/clubs/all/');
  clubQueryPrefetch(user.selected_club);

  return (
    <HydrateClient>
      <Dashboard userId={user.id} />
    </HydrateClient>
  );
}
