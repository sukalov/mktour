import TournamentItemIteratee from '@/components/tournament-item';
import { TournamentWithClub } from '@/lib/db/queries/get-tournaments-to-user-clubs-query';
import Link from 'next/link';
import { FC } from 'react';

const TournamentsContainer: FC<{
  props: TournamentWithClub[];
  grouped?: boolean;
}> = ({ props, grouped }) => {
  if (grouped) {
    return <TournamentGroups props={props} />;
  }
  const data = props.map((prop) => prop.tournament);
  return <>{data.map(TournamentItemIteratee)}</>;
};

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

export default TournamentsContainer;
