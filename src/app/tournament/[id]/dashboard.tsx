'use client';

import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournament/[id]/dashboard-context';
import generateGames from '@/app/tournament/components/helpers/generateGames';
import { playersArray } from '@/app/tournament/components/helpers/players';
import { tabsArray } from '@/app/tournament/components/helpers/tabs';
import TabContent from '@/app/tournament/components/tab-content';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { useParams } from 'next/navigation';
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
  console.log(tournament);
  const [currentTab, setCurrentTab] =
    useState<DashboardContextType['currentTab']>('main');
  const players = playersArray;
  const { games, updatedPlayers } = useMemo(
    () => generateGames(players),
    [players],
  );
  const [currentRound] = useState(games.length - 1);
  const [position, setPosition] = useState(0);
  const [visible, setVisible] = useState(true);
  const top = visible ? 'top-[3.5rem]' : 'top-0';
  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error
  const params = useParams<{ id: string }>();
  console.log(params);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const localStorageContext: LocalStorageTournament = useMemo(() => {
    return { tournament, players: updatedPlayers, games, currentRound };
  }, [currentRound, games, tournament, updatedPlayers]);

  const [localStorage, setLocalStorage] =
    useLocalStorageState<LocalStorageTournament>('tournament', {
      defaultValue: localStorageContext,
    });

  console.log(localStorage.tournament);

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
  }, [position]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  useEffect(() => {
    if (
      tournament.id === params.id &&
      localStorage?.tournament.id !== tournament.id
    ) {
      setLocalStorage(localStorageContext);
    }
  }, [
    localStorage,
    localStorageContext,
    params.id,
    setLocalStorage,
    tournament,
  ]);

  const getTournament = () => {
    if (tournament.id) return tournament;
    if (localStorage.tournament.id === params.id)
      return localStorage.tournament;
    return {} as DatabaseTournament;
  };

  if (!hydrated) return null;
  return (
    <DashboardContext.Provider
      value={{
        tournament: getTournament(),
        players: updatedPlayers,
        games,
        currentRound,
        currentTab,
        top,
      }}
    >
      <TabsContainer
        tabs={tabsArray}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        top={top}
      />
      <TabContent currentTab={currentTab} />
    </DashboardContext.Provider>
  );
};

interface DashboardProps {
  tournament: DatabaseTournament;
}

export type TabProps = {
  tabs: typeof tabsArray;
  currentTab: DashboardContextType['currentTab'];
  setCurrentTab: Dispatch<SetStateAction<DashboardContextType['currentTab']>>;
  top?: string;
};

export type TabType = {
  title: string;
  component: FC;
};

type LocalStorageTournament = Pick<
  DashboardContextType,
  'currentRound' | 'games' | 'players' | 'tournament'
>;

export default Dashboard;
