'use client';

import CarouselContainer from '@/components/dashboard/carousel-container';
import {
  DashboardContext,
  DashboardContextType,
} from '@/components/dashboard/dashboard-context';
import FabWrapper from '@/components/dashboard/fab-wrapper';
import getPossiblePlayers from '@/components/dashboard/helpers/get-possible-players';
import getWsConfig from '@/components/dashboard/helpers/get-ws-config';
import TabsContainer from '@/components/dashboard/tabs-container';
import RoundControls from '@/components/dashboard/tabs/games/round-controls';
import { SOCKET_URL } from '@/lib/config/urls';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { GameModel, TournamentModel } from '@/types/tournaments';
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
  const { isLoading, addPlayer, possiblePlayers, ...tournament } =
    useTournamentStore();
  const { ongoingRound } = useTournamentStore();
  const [roundInView, setRoundInView] = useState(0);
  const { sendJsonMessage } = useWebSocket(
    `${SOCKET_URL}/${id}`,
    getWsConfig(session),
  );

  useEffect(() => {
    tournament.init(state);
    getPossiblePlayers(id, state, {
      isLoading,
      addPlayer,
      possiblePlayers,
      ...tournament,
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [roundInView, currentTab]);

  return (
    <DashboardContext.Provider
      value={{
        currentTab,
        sendJsonMessage
      }}
    >
      <TabsContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <RoundControls
        props={{
          roundInView,
          games: gamesMock,
          setRoundInView,
          currentRound: ongoingRound,
          currentTab,
        }}
      />
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <FabWrapper status={status} currentTab={currentTab} />
    </DashboardContext.Provider>
  );
};

export type TabProps = {
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

export const gamesMock: GameModel[][] = [
  [
    {
      id: 'game1',
      black_id: 'player1',
      white_id: 'player2',
      black_nickname: 'Player One',
      white_nickname: 'Player Two',
      black_prev_game_id: null,
      white_prev_game_id: null,
      round_number: 1,
      round_name: '1/16',
      result: '0-1',
    },
    {
      id: 'game2',
      black_id: 'player3',
      white_id: 'player4',
      black_nickname: 'Player Three',
      white_nickname: 'Player Four',
      black_prev_game_id: null,
      white_prev_game_id: null,
      round_number: 1,
      round_name: '1/16',
      result: '1-0',
    },
  ],
];

export default Dashboard;
