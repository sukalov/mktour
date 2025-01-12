import TournamentItemIteratee from '@/components/tournament-item';
import { validateRequest } from '@/lib/auth/lucia';
import getTournamentsToUserClubsQuery, {
  TournamentWithClub,
} from '@/lib/db/queries/get-tournaments-to-user-clubs-query';
import { Link } from 'lucide-react';
import { redirect } from 'next/navigation';
import { FC } from 'react';

export default async function MyTournaments() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  const tournaments = await getTournamentsToUserClubsQuery({ user });

  return (
    <main className="m-4 flex flex-col items-center gap-4">
      <TournamentGroups props={tournaments} />
    </main>
  );
}

const TournamentGroups: FC<{ props: TournamentWithClub[] }> = ({ props }) => {
  const groupedTournaments = getGroupedTournaments(props);

  return Object.entries(groupedTournaments).map(
    ([clubId, { clubName, tournaments }]) => {
      const data = tournaments.map((tour) => tour.tournament);
      return (
        <div className="flex w-full flex-col gap-2" key={clubId}>
          <Link href={`/club/${clubId}`}>
            <h2 className="text-muted-foreground">{clubName}</h2>
          </Link>
          {data.map(TournamentItemIteratee)}
        </div>
      );
    },
  );
};

const getGroupedTournaments = (props: TournamentWithClub[]) =>
  props.reduce(
    (acc, curr) => {
      const { id: clubId, name: clubName } = curr.club;
      if (!acc[clubId]) {
        acc[clubId] = {
          clubName,
          tournaments: [],
        };
      }
      acc[clubId].tournaments.push(curr);
      return acc;
    },
    {} as Record<
      string,
      { clubName: string; tournaments: TournamentWithClub[] }
    >,
  );
