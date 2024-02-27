'use client';

import { TournamentProps } from '@/app/all-tournaments/tournament-iteratee';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import { players, tabs } from '@/app/tournament/components/mocks';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { createContext, useState } from 'react';

export const TournamentContext = createContext<TournamentProps | null>(null); // FIXME any

export default function Dashboard({tournament}: {tournament: TournamentProps}) {
  const [currentTab, setCurrentTab] = useState('main');
  const [playerStats] = useState(players)

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
    <TournamentContext.Provider value={tournament}>
      <div className="flex flex-col gap-4 p-4">
        {/* {tournament.title} */}
        <TabsContainer currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <CarouselContainer
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          players={playerStats}
          tabs={tabs}
          // handleResult={handleResult}
        />
      </div>
    </TournamentContext.Provider>
  );
}
