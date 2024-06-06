import Main from '@/app/club/dashboard/main';
import { getUser } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function ClubPage() {
  const user = await getUser()
  const club = await db
    .select()
    .from(clubs)
    .where(eq(clubs.id, user.selected_club));
  
    return <Main club={club[0]} />;
}
