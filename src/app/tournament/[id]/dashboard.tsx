'use client';

import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import ComponentsContainer from '@/app/tournament/components/components-container';
import generateGames from '@/app/tournament/components/helpers/generateGames';
import { playersArray } from '@/app/tournament/components/helpers/players';
import { tabsArray } from '@/app/tournament/components/helpers/tabs';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { FC, useEffect, useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';

const Dashboard: FC<DashboardProps> = ({ tournament }) => {
  const [currentTab, setCurrentTab] = useState<string>('main');
  const tabs = tabsArray;
  const players = playersArray;
  const games = generateGames(players);
  const [currentRound] = useState(games.length - 1);
  const context = {
    tournament,
    tabs,
    currentTab,
    setCurrentTab,
    players,
    games,
    currentRound,
  };

  // eslint-disable-next-line no-unused-vars
  const [value, setValue, { removeItem }] = useLocalStorageState<{}>(
    'tournament',
    {
      defaultValue: [tournament],
    },
  );

  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setValue(tournament);
  }, [games, players, setValue, tournament]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  if (!hydrated) return null;
  return (
    <TournamentContext.Provider value={context}>
      <TabsContainer />
      <ComponentsContainer />
    </TournamentContext.Provider>
  );
};

interface DashboardProps {
  tournament: DatabaseTournament;
}

export default Dashboard;
