'use client';

import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournament/[id]/dashboard-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import { tabs } from '@/app/tournament/components/helpers/tabs';
import RoundControls from '@/app/tournament/components/round-controls';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { TournamentModel } from '@/types/tournaments';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

const Dashboard: FC<{ tournament: TournamentModel }> = ({ tournament }) => {
  const [currentTab, setCurrentTab] =
    useState<DashboardContextType['currentTab']>('main');
  const {
    id,
    date,
    title,
    type,
    format,
    organizer,
    status,
    roundsNumber,
    players,
  } = tournament;
  const [controlsTop, setControlsTop] = useState('top-0');
  const [roundInView, setRoundInView] = useState(0);
  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  if (!hydrated) return null;
  return (
    <DashboardContext.Provider
      value={{
        tournament,
        currentTab,
        roundInView,
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
