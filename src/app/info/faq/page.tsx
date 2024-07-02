import { db } from '@/lib/db';
import { clubs, tournaments } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function AboutPage() {
  const result = (
    await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, '99qyYbFR'))
      .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
  ).at(0);

  console.log(result);
  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
