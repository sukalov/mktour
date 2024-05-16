'use client';

import CarouselContainer from '@/components/dashboard/carousel-container';
import {
  DashboardContext,
  DashboardContextType,
} from '@/components/dashboard/dashboard-context';
import Fab from '@/components/dashboard/fab';
import getPossiblePlayers from '@/components/dashboard/helpers/get-possible-players';
import getWsConfig from '@/components/dashboard/helpers/get-ws-config';
import { tabs } from '@/components/dashboard/helpers/tabs';
import RoundControls from '@/components/dashboard/round-controls';
import TabsContainer from '@/components/dashboard/tabs-container';
import { SOCKET_URL } from '@/lib/config/urls';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { TournamentModel } from '@/types/tournaments';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const Dashboard: FC<TournamentPageContentProps> = ({
  state,
  session,
  id,
  status,
}) => {
  const [currentTab, setCurrentTab] =
    useState<DashboardContextType['currentTab']>('main');
  const { games, ongoingRound } = state;
  const [controlsTop, setControlsTop] = useState('top-0');
  const [roundInView, setRoundInView] = useState(0);

  const { isLoading, addPlayer, possiblePlayers, ...tournament } =
    useTournamentStore();

  useEffect(() => {
    tournament.init(state);
  }, []);

  useEffect(() => {
    getPossiblePlayers(id, state, {
      isLoading,
      addPlayer,
      possiblePlayers,
      ...tournament,
    });
  }, []);

  const { sendJsonMessage } = useWebSocket(
    `${SOCKET_URL}/${id}`,
    getWsConfig(session),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  return (
    <DashboardContext.Provider
      value={{
        currentTab,
        roundInView,
        sendJsonMessage,
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
        tournament={tournament}
      />
      {status === 'organizer' && <Fab />}
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
  title: 'main' | 'table' | 'games';
  component: FC;
};

export interface TournamentPageContentProps {
  session: string;
  id: string;
  state: TournamentModel;
  status: Status;
}

export default Dashboard;
