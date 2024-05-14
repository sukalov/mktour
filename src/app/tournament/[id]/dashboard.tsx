'use client';

import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournament/[id]/dashboard-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import { tabs } from '@/app/tournament/components/helpers/tabs';
import RoundControls from '@/app/tournament/components/round-controls';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { SOCKET_URL } from '@/lib/config/urls';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { handleSocketMessage } from '@/lib/handle-socket-message';
import { TournamentModel } from '@/types/tournaments';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const Dashboard: FC<{ state: TournamentModel } & Pick<TournamentPageContentProps, 'session'>> = ({ state, session }) => {
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
    games,
    ongoingRound,
  } = state;
  const [controlsTop, setControlsTop] = useState('top-0');
  const [roundInView, setRoundInView] = useState(0);
  const [hydrated, setHydrated] = useState(false); // helper for random result generator to avoid hydration error

  const { sendJsonMessage } = useWebSocket(`${SOCKET_URL}/${id}`, {
    queryParams: {
      auth_session: session,
    },
    onOpen: () => console.log('opened'),
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
      message: '',
    },
    onMessage: (event) => {
      if (!event.data) return;
      const message = JSON.parse(event.data);
      handleSocketMessage(message);
    },
  });

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
        tournament: state,
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
          currentRound: ongoingRound,
          controlsTop,
        }}
      />
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setControlsTop={setControlsTop}
      />
    </DashboardContext.Provider>
  );
};

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

export interface TournamentPageContentProps {
  session: string;
  id: string;
  state: TournamentModel;
  status: Status;
}

export default Dashboard;
