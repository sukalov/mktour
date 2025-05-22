import ClubPage from '@/app/clubs/[id]/club';
import Loading from '@/app/loading';
import { publicCaller } from '@/server/api';
import { Suspense } from 'react';

export default async function Page(props: ClubPageProps) {
  const params = await props.params;
  const clubPromise = publicCaller.club.info({ clubId: params.id });

  return (
    <Suspense fallback={<Loading />}>
      <ClubPage clubPromise={clubPromise} />
    </Suspense>
  );
}

export interface ClubPageProps {
  params: Promise<{ id: string }>;
}
