'use client';

import {
  TournamentContext,
  TournamentContextType,
} from '@/app/tournament/[id]/tournament-context';
import DashboardContent from '@/app/tournament/components/dashboard-content';
import generateGames from '@/app/tournament/components/helpers/generateGames';
import { playersArray } from '@/app/tournament/components/helpers/players';
import { tabsArray } from '@/app/tournament/components/helpers/tabs';
import TabsContainer from '@/app/tournament/components/tabs-container';
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
  const [currentTab, setCurrentTab] =
    useState<TournamentContextType['currentTab']>('main');
  const players = playersArray;
  const { games, updatedPlayers } = useMemo(
    () => generateGames(players),
    [players],
  );
  const [currentRound] = useState(games.length - 1);
  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);

  const localStorageContext: LocalStorageTournament = useMemo(() => {
    return { tournament, players: updatedPlayers, games, currentRound };
  }, [currentRound, games, tournament, updatedPlayers]);

  const [localStorage, setLocalStorage] =
    useLocalStorageState<LocalStorageTournament>('tournament', {
      defaultValue: localStorageContext,
    });


  useEffect(() => {
    const handleScroll = () => {
      let moving = window.scrollY;

      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const top = visible ? 'top-[3.5rem]' : 'top-0';

  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  useEffect(() => {
    if (localStorage.tournament?.id !== tournament?.id) {
      setLocalStorage(localStorageContext);
    }
  }, [
    localStorage.tournament?.id,
    localStorageContext,
    setLocalStorage,
    tournament?.id,
  ]);

  if (!hydrated) return null;
  return (
    <TournamentContext.Provider
      value={{
        tournament,
        players: updatedPlayers,
        games,
        currentRound,
        currentTab,
        top
      }}
    >
      <TabsContainer
        tabs={tabsArray}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        top={top}
      />
      <DashboardContent currentTab={currentTab} />
    </TournamentContext.Provider>
  );
};

interface DashboardProps {
  tournament: DatabaseTournament;
}

export type TabProps = {
  tabs: typeof tabsArray;
  currentTab: TournamentContextType['currentTab'];
  setCurrentTab: Dispatch<SetStateAction<TournamentContextType['currentTab']>>;
  top?: string;
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
