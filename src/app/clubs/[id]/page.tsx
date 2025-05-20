import ClubPage from '@/app/clubs/[id]/club';
import { db } from '@/server/db';
import { clubs } from '@/server/db/schema/clubs';
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
