import { TournamentDashboard } from '@/app/tournament/[id]/tournament-dashboard';
import { getUser } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { clubs, clubs_to_users, DatabaseClub, DatabaseTournament, tournaments } from '@/lib/db/schema/tournaments';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const user = await getUser();
  console.log({user})
  if (!user) redirect(`/tournament/${params.id}/view`);
  const { tournament, club } = (
    await db // TODO tol - extract db queries to separate hook
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, params.id))
      .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
  ).at(0) as TournamentToClubLeftJoin;
  const status =
    (
      await db
        .select()
        .from(clubs_to_users)
        .where(
          and(
            eq(clubs_to_users.user_id, user.id),
            eq(clubs_to_users.club_id, club.id),
          ),
        )
    )[0]?.status;

    if (status === undefined) redirect(`/tournament/${params.id}/view`);

  const req = await fetch('https://mktour-f4u4zj6bdq-lz.a.run.app', {
    next: { revalidate: 0 },
    headers: {
      Authorization: `Bearer ${cookies().get('token')?.value}`,
      Cookie: cookies().toString()
    },
  });

  return (
    <div className="flex w-full flex-col items-start justify-between gap-4">
      <pre>{JSON.stringify({ user, tournament, club, status }, null, 2)}</pre>
      <pre>{JSON.stringify({ req }, null, 2)}</pre>
      <TournamentDashboard tournamentId={tournament.id}/>
    </div>
  );
}

interface TournamentPageProps {
  params: { id: string };
}

interface TournamentToClubLeftJoin {
  tournament: DatabaseTournament;
  club: DatabaseClub;
}
