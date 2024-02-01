import NewTournamentForm from '@/app/new-tournament/new-tournament-form';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { clubs_to_users } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function NewTournament() {
  const { user } = await validateRequest()
  const clubs = await db.select().from(clubs_to_users).where(eq(clubs_to_users.user_id, user?.id));
  return (
    <div className="w-full">
      <NewTournamentForm />
    </div>
  );
}
