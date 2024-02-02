import NewTournamentForm from '@/app/new-tournament/new-tournament-form';
import { getUser } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { DatabaseClub, clubs, clubs_to_users } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function NewTournament() {
  const user = await getUser();
  const userClubs = (await db
    .select()
    .from(clubs_to_users)
    .where(eq(clubs_to_users.user_id, user.id))
    .leftJoin(clubs, eq(clubs_to_users.club_id, clubs.id)))
    .map(el => el.club) as DatabaseClub[];
  return (
    <>
      {user && (
        <div className="w-full">
          <NewTournamentForm clubs={userClubs} user={user} />
        </div>
      )}
    </>
  );
}
