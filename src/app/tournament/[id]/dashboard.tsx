'use client';

import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournament/[id]/dashboard-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import Fab from '@/app/tournament/components/fab';
import { tabs } from '@/app/tournament/components/helpers/tabs';
import RoundControls from '@/app/tournament/components/round-controls';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { SOCKET_URL } from '@/lib/config/urls';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { handleSocketMessage } from '@/lib/handle-socket-message';
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
    (async () => {
      const possiblePlayersReq = await fetch(
        '/api/tournament-possible-players',
        {
          method: 'POST',
          body: JSON.stringify({
            id,
            tournament: state,
          }),
        },
      );
      console.log(possiblePlayersReq);
      const possiblePlayers =
        (await possiblePlayersReq.json()) as Array<DatabasePlayer>;
      console.log(possiblePlayers);
      tournament.initPossiblePlayers(possiblePlayers);
    })();
  }, []);

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
    window.scrollTo(0, 0);
  }, [currentTab]);

  return (
    <DashboardContext.Provider
      value={{
        tournament: { isLoading, addPlayer, possiblePlayers, ...tournament },
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
      />
      {status === 'organizer' && <Fab currentTab={currentTab} />}
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
