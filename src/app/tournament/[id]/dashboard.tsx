'use client';

import {
  TournamentContext
} from '@/app/tournament/[id]/tournament-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import generateGames from '@/app/tournament/components/helpers/generateGames';
import { playersArray } from '@/app/tournament/components/helpers/players';
import { tabsArray } from '@/app/tournament/components/helpers/tabs';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { Format, TournamentType } from '@/types/tournaments';
import { FC, useEffect, useState } from 'react';

const Dashboard: FC<DashboardProps> = ({ tournament }) => {
  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration errors
  const [currentTab, setCurrentTab] = useState<string>('main');
  const [currentRound] = useState(0);
  const tabs = tabsArray;
  const players = playersArray;
  const games = generateGames(players);
  const context = {
    tournament,
    tabs,
    currentTab,
    setCurrentTab,
    players,
    games,
    currentRound,
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  return (
    <TournamentContext.Provider value={context}>
      <div className="flex flex-col gap-4 p-4">
        <TabsContainer />
        <CarouselContainer />
      </div>
    </TournamentContext.Provider>
  );
};

interface DashboardProps {
  tournament: TournamentProps;
}

export type TournamentProps = {
  id: string;
  title: string | null;
  date: string | null;
  format: Format | null;
  type: TournamentType | null;
  timestamp: number | null;
  club_id: string;
  is_started: boolean | null;
  is_closed: boolean | null;
};

export default Dashboard;
