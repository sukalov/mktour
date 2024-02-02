'use client';

import CarouselContainer from '@/app/test-dashboard/components/carousel';
import { players, tabs } from '@/app/test-dashboard/components/mocks';
import TabsContainer from '@/app/test-dashboard/components/tabs';
import { useState } from 'react';

export default function Main() {
  const [currentTab, setCurrentTab] = useState('table');
  const [playerStats, setPlayerStats] = useState(players);

  const handleResult = (
    playerIndex: number,
    stat: 'win' | 'loose' | 'draw',
  ) => {
    setPlayerStats((prevPlayers: any) => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        [stat]: newPlayers[playerIndex][stat] + 1,
      };
      return newPlayers;
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <TabsContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        players={playerStats}
        tabs={tabs}
        handleResult={handleResult}
      />
    </div>
  );
}
