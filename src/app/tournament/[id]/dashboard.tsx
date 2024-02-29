'use client';

import Brackets from '@/app/tournament/(tabs)/brackets';
import Main from '@/app/tournament/(tabs)/main';
import MockSlot from '@/app/tournament/(tabs)/mock-slot';
import MockSlotWithLongTitle from '@/app/tournament/(tabs)/mock-slot-with-long-title';
import TournamentTable from '@/app/tournament/(tabs)/table';
import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import CarouselContainer from '@/app/tournament/components/carousel-container';
import TabsContainer from '@/app/tournament/components/tabs-container';
import { Format, TournamentType } from '@/types/tournaments';
import { FC, useState } from 'react';

const Dashboard: FC<DashboardProps> = ({ tournament }) => {
  const [currentTab, setCurrentTab] = useState<string>('main');
  const tabs = [
    { title: 'main', component: Main },
    { title: 'table', component: TournamentTable },
    { title: 'brackets', component: Brackets },
    { title: 'mock slot with long title', component: MockSlotWithLongTitle },
    { title: 'mock slot', component: MockSlot },
  ];
  
  const players = Array.from({ length: 16 }, (_, i) => ({
    name: `player${i + 1}`,
    win: 0,
    loose: 0,
    draw: 0,
  }));
  const context = { tournament, tabs, currentTab, setCurrentTab, players };

  return (
    <TournamentContext.Provider value={context}>
      <div className="flex flex-col gap-4 p-4">
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
