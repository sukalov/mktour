'use client';

import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournament/[id]/dashboard-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import generateGames from '@/app/tournament/components/helpers/generateGames';
import { playersArray } from '@/app/tournament/components/helpers/players';
import { tabs } from '@/app/tournament/components/helpers/tabs';
import RoundControls from '@/app/tournament/components/round-controls';
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
    useState<DashboardContextType['currentTab']>('main');
  const players = playersArray;
  const { games, updatedPlayers } = useMemo(
    () => generateGames(players),
    [players],
  );
  const [currentRound] = useState(games.length - 1);
  // const [visible, setVisible] = useState(true);
  // const top = visible ? 'top-[3.5rem]' : 'top-0';
  const [controlsTop, setControlsTop] = useState('top-0');
  const [roundInView, setRoundInView] = useState(currentRound);
  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  useEffect(() => {
    if (localStorage?.tournament.id !== tournament.id) {
      setLocalStorage(localStorageContext);
    }
  }, [
    localStorage?.tournament.id,
    localStorageContext,
    setLocalStorage,
    tournament.id,
  ]);

  if (!hydrated) return null;
  return (
    <DashboardContext.Provider
      value={{
        tournament: tournament,
        players: updatedPlayers,
        games,
        currentRound,
        currentTab,
      }}
    >
      <TabsContainer
        tabs={tabs}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

        <RoundControls
          props={{
            roundInView,
            games,
            setRoundInView,
            currentRound,
            controlsTop,
          }}
        />
      {/* <ScrollDetector setVisible={setVisible}> */}
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setControlsTop={setControlsTop}
      />
      {/* </ScrollDetector> */}
    </DashboardContext.Provider>
  );
};

interface DashboardProps {
  tournament: DatabaseTournament;
}

export type TabProps = {
  tabs: typeof tabs;
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
