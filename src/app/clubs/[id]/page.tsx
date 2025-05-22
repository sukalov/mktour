import ClubPage from '@/app/clubs/[id]/club';
import { publicCaller } from '@/server/api';
import { unstable_noStore } from 'next/cache';
import { notFound } from 'next/navigation';

export default async function Page(props: ClubPageProps) {
  const params = await props.params;
  unstable_noStore();
  try {
    const club = await publicCaller.club.info({ clubId: params.id });
    return <ClubPage club={club} />;
  } catch (e) {
    console.log(e);
    notFound();
  }
}

export interface ClubPageProps {
  params: Promise<{ id: string }>;
}
