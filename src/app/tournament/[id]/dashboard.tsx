'use client';

import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { Format, TournamentType } from '@/types/tournaments';
import { FC, useState } from 'react';

const Dashboard: FC<DashboardProps> = ({tournament}) => {
  const [currentTab, setCurrentTab] = useState('main');
  // const [playerStats] = useState(players);
  const tabs = [
    'main',
    'table',
    'brackets',
    'mock slot with long title',
    'mock slot',
  ];
  const players = Array.from({ length: 16 }, (_, i) => ({
    name: `player${i + 1}`,
    win: 0,
    loose: 0,
    draw: 0,
  }));
  const context = { tournament, tabs, currentTab, setCurrentTab, players };

  // const handleResult = (
  //   playerIndex: number,
  //   stat: 'win' | 'loose' | 'draw',
  // ) => {
  //   setPlayerStats((prevPlayers: any) => {
  //     const newPlayers = [...prevPlayers];
  //     newPlayers[playerIndex] = {
  //       ...newPlayers[playerIndex],
  //       [stat]: newPlayers[playerIndex][stat] + 1,
  //     };
  //     return newPlayers;
  //   });
  // };

  return (
    <TournamentContext.Provider value={context}>
      <div className="flex flex-col gap-4 p-4">
        {/* {tournament.title} */}
        <TabsContainer />
        <CarouselContainer />
      </div>
    </TournamentContext.Provider>
  );
};

interface DashboardProps {
  tournament: TournamentProps;
}

export type TournamentProps = {
  id: string;
  title: string | null;
  date: string | null;
  format: Format | null;
  type: TournamentType | null;
  timestamp: number | null;
  club_id: string;
  is_started: boolean | null;
  is_closed: boolean | null;
};

export default Dashboard;
