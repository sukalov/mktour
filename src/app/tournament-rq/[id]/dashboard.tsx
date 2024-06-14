'use client';

import {
  DashboardContextType
} from '@/components/dashboard-rq/dashboard-context';
import { getTournamentPossiblePlayers } from '@/lib/actions/tournament-managing';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { GameModel } from '@/types/tournaments';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction } from 'react';

const Dashboard: FC<TournamentPageContentProps> = ({
  // session,
  id,
  // status,
}) => {
  // const [currentTab, setCurrentTab] =
    // useState<DashboardContextType['currentTab']>('main');
  // const { sendJsonMessage } = useWebSocket(
  //   `${SOCKET_URL}/${id}`,
  //   getWsConfig(session),
  // );

  const possiblePlayers = useQuery({
    queryKey: ['players', 'possible', id],
    queryFn: async () => await getTournamentPossiblePlayers(id),
    staleTime: 1000 * 60 * 15
  })

  console.log(possiblePlayers.data)

  // const [scrolling, setScrolling] = useState(false);

  return (
    // <DashboardContext.Provider
    //   value={{
    //     currentTab,
    //     sendJsonMessage,
    //     status,
    //   }}
    // >
    //   <TabsContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
    //   <CarouselContainer
    //     currentTab={currentTab}
    //     setCurrentTab={setCurrentTab}
    //     setScrolling={setScrolling}
    //   />
    //   <FabProvider
    //     status={status}
    //     currentTab={currentTab}
    //     scrolling={scrolling}
    //   />
    // </DashboardContext.Provider>
    <></>
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
