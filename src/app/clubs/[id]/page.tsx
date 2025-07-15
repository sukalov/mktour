import ClubPage from '@/app/clubs/[id]/club';
import { validateRequest } from '@/lib/auth/lucia';
import { publicCaller } from '@/server/api';
import getStatusInClub from '@/server/queries/get-status-in-club';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page(props: ClubPageProps) {
  const params = await props.params;
  const club = await publicCaller.club.info({ clubId: params.id });
  const { user } = await validateRequest();
  const statusInClub = await getStatusInClub({
    clubId: params.id,
    userId: user?.id || '',
  });

  if (!club) notFound();
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ClubPage
        club={club}
        statusInClub={statusInClub}
        userId={user?.id || ''}
      />
    </Suspense>
  );
}

export interface ClubPageProps {
  params: Promise<{ id: string }>;
}
