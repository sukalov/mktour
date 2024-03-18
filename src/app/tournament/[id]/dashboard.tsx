'use client';

import {
  TournamentContext
} from '@/app/tournament/[id]/tournament-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import generateGames from '@/app/tournament/components/helpers/generateGames';
import { playersArray } from '@/app/tournament/components/helpers/players';
import { tabsArray } from '@/app/tournament/components/helpers/tabs';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { FC, useEffect, useState } from 'react';

const Dashboard: FC<DashboardProps> = ({ tournament }) => {
  const [currentTab, setCurrentTab] = useState<string>('main');
  const [currentRound] = useState(7);
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
  
  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  return (
    <TournamentContext.Provider value={context}>
      <TabsContainer />
      <CarouselContainer />
    </TournamentContext.Provider>
  );
};

interface DashboardProps {
  tournament: DatabaseTournament;
}

export default Dashboard;
