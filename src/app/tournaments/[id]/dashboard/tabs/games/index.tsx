'use client';

import RoundsMobile from '@/app/tournaments/[id]/dashboard/tabs/games/rounds-mobile';
import { useTournamentGames } from '@/components/hooks/query-hooks/use-tournament-games';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

const Games: FC = () => {
  const id = usePathname().split('/').at(-1) as string;
  const { data } = useTournamentGames(id);
  console.log(data)
  return <RoundsMobile />;
};

export default Games;
