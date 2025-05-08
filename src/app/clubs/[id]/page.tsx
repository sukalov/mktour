import ClubPage from '@/app/clubs/[id]/club';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function Page(props: ClubPageProps) {
  const params = await props.params;
  const [club] = await db.select().from(clubs).where(eq(clubs.id, params.id));
  if (!club) notFound();

  return <ClubPage club={club} />;
}

export interface ClubPageProps {
  params: Promise<{ id: string }>;
}
