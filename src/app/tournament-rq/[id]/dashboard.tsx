'use client';

import CarouselContainer from '@/components/dashboard-rq/carousel-container';
import { DashboardContext, DashboardContextType } from '@/components/dashboard-rq/dashboard-context';
import FabProvider from '@/components/dashboard-rq/fab-provider';
import TabsContainer from '@/components/dashboard-rq/tabs-container';
import getWsConfig from '@/components/helpers/get-ws-config';
import { SOCKET_URL } from '@/lib/config/urls';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { GameModel } from '@/types/tournaments';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const Dashboard: FC<TournamentPageContentProps> = ({
  session,
  id,
  status,
}) => {
  const [scrolling, setScrolling] = useState(false);
  const [currentTab, setCurrentTab] =
    useState<DashboardContextType['currentTab']>('main');
  const { sendJsonMessage } = useWebSocket(
    `${SOCKET_URL}/${id}`,
    getWsConfig(session),
  );

  return (
    <DashboardContext.Provider
      value={{
        currentTab,
        sendJsonMessage,
        status,
      }}
    >
      <TabsContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setScrolling={setScrolling}
      />
      <FabProvider
        status={status}
        currentTab={currentTab}
        scrolling={scrolling}
      />
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
  status: Status;
}

export const gamesMock: GameModel[][] = [
  [
    {
      id: 'game1',
      black_id: 'player1',
      white_id: 'player2',
      black_nickname: 'Player Oooooooooone',
      white_nickname: 'Player Twoooooooooo',
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
