import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function ClubPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/club/explore');
  const club = await db
    .select()
    .from(clubs)
    .where(eq(clubs.id, user.selected_club));
  return (
    <pre className="flex w-full flex-wrap text-wrap">
      {JSON.stringify(club, null, 2)}
    </pre>
  );
}
