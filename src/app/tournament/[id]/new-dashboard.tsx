'use client';

import CarouselContainer from '@/app/tournament/components/carousel-container';
import { players, tabs } from '@/app/tournament/components/mocks';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { useState } from 'react';

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState('main');
  const [playerStats, setPlayerStats] = useState(players);

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
    <div className="flex flex-col gap-4 p-4">
      <TabsContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        players={playerStats}
        tabs={tabs}
        // handleResult={handleResult}
      />
    </div>
  );
}
