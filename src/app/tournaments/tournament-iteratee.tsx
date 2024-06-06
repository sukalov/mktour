'use client';

import getGroupedTournaments from '@/components/helpers/get-grouped-tournaments';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TournamentWithClub } from '@/lib/db/hooks/use-tournaments-to-user-clubs-query';
import Link from 'next/link';
import { FC } from 'react';

const TournamentsContainer: FC<{
  props: TournamentWithClub[];
  grouped?: boolean;
}> = ({ props, grouped }) => {
  if (grouped) {
    const groupedTournaments = getGroupedTournaments(props);
    return (
      <>
        {Object.entries(groupedTournaments).map(
          ([clubId, { clubName, tournaments }]) => (
            <div className="flex w-full flex-col gap-2" key={clubName}>
              <Link href={`/club/${clubId}`}>
                <h2>{clubName}</h2>
              </Link>
              {tournaments.map((tournamentData) => (
                <TournamentIteratee
                  key={tournamentData.tournament.id}
                  grouped
                  {...tournamentData}
                />
              ))}
            </div>
          ),
        )}
      </>
    );
  }
  return <>{props.map(TournamentIteratee)}</>;
};

const TournamentIteratee = ({
  tournament,
  club,
  grouped,
}: TournamentWithClub & { grouped?: boolean }) => {
  const details = [tournament.type, tournament.format, tournament.date];

  const description = details.map((detail, i) => {
    const separator = i === details.length - 1 ? '' : '|';
    return <span key={i}>{`${detail} ${separator}`}</span>;
  });

  return (
    <Link
      key={tournament.id}
      href={`/tournament/${tournament.id}`}
      className="flex w-full flex-col"
    >
      <Card>
        <CardHeader>
          <CardTitle>{tournament.title}</CardTitle>
          <CardDescription className="flex gap-2">
            {description}
          </CardDescription>
          {!grouped && <span className="text-xs text-muted">{club.name}</span>}
        </CardHeader>
      </Card>
    </Link>
  );
};

export default TournamentsContainer;
