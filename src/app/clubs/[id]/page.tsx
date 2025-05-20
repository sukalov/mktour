import ClubPage from '@/app/clubs/[id]/club';
import { publicCaller } from '@/server';
import { notFound } from 'next/navigation';

export default async function Page(props: ClubPageProps) {
  const params = await props.params;
  const club = await publicCaller.club.clubById({ clubId: params.id });
  if (!club) notFound();

  return <ClubPage club={club} />;
}

export interface ClubPageProps {
  params: Promise<{ id: string }>;
}
