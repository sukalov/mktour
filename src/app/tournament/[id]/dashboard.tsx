'use client';

import {
  TournamentContext,
  TournamentContextType,
} from '@/app/tournament/[id]/tournament-context';
import generateGames from '@/app/tournament/components/helpers/generateGames';
import { playersArray } from '@/app/tournament/components/helpers/players';
import { tabsArray } from '@/app/tournament/components/helpers/tabs';
import TabsContainer from '@/app/tournament/components/tabs-container';
import TournamentContent from '@/app/tournament/components/tournament-content';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useLocalStorageState from 'use-local-storage-state';

const Dashboard: FC<DashboardProps> = ({ tournament }) => {
  const [currentTab, setCurrentTab] = useState<string>('main');
  const players = playersArray
  const { games, updatedPlayers } = generateGames(players);
  const [currentRound] = useState(games.length - 1);
  const localStorageContext: LocalStorageTournament = useMemo(() => {
    return { tournament, players: updatedPlayers, games, currentRound };
  }, [currentRound, games, tournament, updatedPlayers]);

  const [value, setValue] = useLocalStorageState<LocalStorageTournament>(
    'tournament',
    {
      defaultValue: localStorageContext,
    },
  );

  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  useEffect(() => {
    if (value.tournament?.id !== tournament?.id) {
      setValue(localStorageContext);
    }
  }, [localStorageContext, setValue, tournament?.id, value.tournament?.id]);

  if (!hydrated) return null;
  return (
    <TournamentContext.Provider
      value={{
        tournament,
        players: updatedPlayers,
        games,
        currentRound,
      }}
    >
      <TabsContainer
        tabs={tabsArray}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <TournamentContent currentTab={currentTab} />
    </TournamentContext.Provider>
  );
};

interface DashboardProps {
  tournament: DatabaseTournament;
}

export type TabProps = {
  tabs: typeof tabsArray;
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
};

export type TabType = {
  title: string;
  component: FC;
};

type LocalStorageTournament = Pick<
  TournamentContextType,
  'currentRound' | 'games' | 'players' | 'tournament'
>;

export default Dashboard;
