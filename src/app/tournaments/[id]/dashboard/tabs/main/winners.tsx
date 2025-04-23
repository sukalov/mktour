'use client';

import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { PlayerModel, TournamentInfo } from '@/types/tournaments';
import Link from 'next/link';
import { FC } from 'react';

const Winners: FC<TournamentInfo> = ({ tournament }) => {
  const { data: players } = useTournamentPlayers(tournament.id);
  const winners = players?.filter(({ place }) => place && place <= 3);

  if (!winners || !tournament.closed_at) return null;
  return (
    <div className="flex flex-col gap-8 mk-link">
      {winners.map((player) => (
        <Player key={player.id} {...player} />
      ))}
    </div>
  );
};

const Player: FC<PlayerModel> = ({ id, nickname, place }) => {
  if (!place) return null;
  return (
    <div className="flex items-center gap-2 truncate">
      <Medal className={`size-6 ${medalColour[place - 1]}`} />
      <Link href={`/player/${id}`}> {nickname}</Link>
    </div>
  );
};

export const Medal: FC<{ className: string }> = ({ className }) => (
  <div className={`aspect-square rounded-full ${className}`} />
);

export const medalColour = ['bg-amber-300', 'bg-gray-300', 'bg-amber-700'];

export default Winners;
