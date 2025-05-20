import ClubPage from '@/app/clubs/[id]/club';
import { publicCaller } from '@/server/api';
import { notFound } from 'next/navigation';

export default async function Page(props: ClubPageProps) {
  const params = await props.params;
  let club;
  try {
    club = await publicCaller.club.info({ clubId: params.id });
  } catch (e) {
    console.error(e);
    notFound();
  }

  return <ClubPage club={club} />;
}

export interface ClubPageProps {
  params: Promise<{ id: string }>;
}
