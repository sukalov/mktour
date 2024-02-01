'use client';

import CarouselContainer from '@/app/test-dashboard/components/carousel';
import TabsContainer from '@/app/test-dashboard/components/tabs';
import { useState } from 'react';
export default function Main() {
  const [currentTab, setCurrentTab] = useState('table');

  return (
    <div className="flex flex-col gap-4 p-4">
      <TabsContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      ></TabsContainer>
      <CarouselContainer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        players={players}
        tabs={tabs}
      ></CarouselContainer>
    </div>
  );
}

const tabs = ['table', 'brackets'];

const players = [
  {
    name: 'player1',
    win: 0,
    loose: 0,
    draw: 0,
  },
  {
    name: 'player2',
    win: 0,
    loose: 0,
    draw: 0,
  },
  {
    name: 'player3',
    win: 0,
    loose: 0,
    draw: 0,
  },
  {
    name: 'player4',
    win: 0,
    loose: 0,
    draw: 0,
  },
];