'use client';

import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { PlayerModel, TournamentInfo } from '@/types/tournaments';
import Link from 'next/link';
import { FC } from 'react';

const Winners: FC<TournamentInfo> = ({ tournament }) => {
  const { data: players } = useTournamentPlayers(tournament.id);
  const winners = groupWinnersByPlace(players);

  if (!winners || !tournament.closed_at) return null;
  return (
    <div className="flex flex-col gap-8">
      {Object.entries(winners).map(([place, players]) => (
        <MedalGroup key={place} place={place} players={players} />
      ))}
    </div>
  );
};

const MedalGroup: FC<{ place: string; players: PlayerModel[] }> = ({
  place,
  players,
}) => {
  return (
    <div className="flex items-start gap-2 truncate">
      <Medal className={`size-6 ${medalColour[parseInt(place) - 1]}`} />
      <div className="flex flex-col gap-2">
        {players.map(({ id, nickname }, i) => {
          const shouldShowSeparator =
            players.length > 1 && i < players.length - 1;

          return (
            <div key={id}>
              <Link href={`/player/${id}`} className="mk-link">
                {' '}
                {nickname}
              </Link>
              {shouldShowSeparator && ','}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Medal: FC<{ className: string }> = ({ className }) => (
  <div className={`aspect-square rounded-full ${className}`} />
);

export const medalColour = ['bg-amber-300', 'bg-gray-300', 'bg-amber-700'];

const groupWinnersByPlace = (players: PlayerModel[] | undefined) => {
  const winners = players?.filter(({ place }) => place && place <= 3);

  if (!winners) return {};
  return winners.reduce(
    (acc, player) => {
      const place = player.place || 0;
      if (!acc[place]) {
        acc[place] = [];
      }
      acc[place].push(player);
      return acc;
    },
    {} as Record<number, PlayerModel[]>,
  );
};

export default Winners;
