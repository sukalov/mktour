'use client';

import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournament/[id]/dashboard-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import Fab from '@/app/tournament/components/fab';
import getPossiblePlayers from '@/app/tournament/components/helpers/get-possible-players';
import getWsConfig from '@/app/tournament/components/helpers/get-ws-config';
import { tabs } from '@/app/tournament/components/helpers/tabs';
import RoundControls from '@/app/tournament/components/round-controls';
import TabsContainer from '@/app/tournament/components/tabs-container';
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
