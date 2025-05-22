import ClubPage from '@/app/clubs/[id]/club';
import { publicCaller } from '@/server/api';

export default async function Page(props: ClubPageProps) {
  const params = await props.params;
  const clubPromise = publicCaller.club.info({ clubId: params.id });

  return <ClubPage clubPromise={clubPromise} />;
}

export interface ClubPageProps {
  params: Promise<{ id: string }>;
}
