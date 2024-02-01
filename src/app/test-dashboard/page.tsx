'use client';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

const tabs = ['table', 'brackets'];

const CarouselContainer = ({ currentTab, setCurrentTab }: any) => {
  const [api, setApi] = useState<CarouselApi>();
  const currentIndex = tabs.indexOf(currentTab);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('slidesInView', () => {
      let num = api.slidesInView()[0];
      setCurrentTab(tabs[num]);
    });
    if (currentTab) api.scrollTo(currentIndex);
  }, [api, currentIndex, currentTab, setCurrentTab]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>
          <StyledCard>
            <TournamentTable />
          </StyledCard>
        </CarouselItem>
        <CarouselItem>
          <StyledCard>Brackets will be shown here</StyledCard>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

const TabsContainer = ({ currentTab, setCurrentTab }: any) => {
  const value = currentTab || 'table';

  return (
    <Tabs
      defaultValue="table"
      onValueChange={(value) => setCurrentTab(value)}
      value={value}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="table">table</TabsTrigger>
        <TabsTrigger value="brackets">brackets</TabsTrigger>
      </TabsList>
      <TabsContent value="table"></TabsContent>
      <TabsContent value="brackets"></TabsContent>
    </Tabs>
  );
};

const TournamentTable = () => {
  const [playerStats, setPlayerStats] = useState(players);

  const handleResult = (
    playerIndex: number,
    stat: 'win' | 'loose' | 'draw',
  ) => {
    setPlayerStats((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers[playerIndex] = {
        ...newPlayers[playerIndex],
        [stat]: newPlayers[playerIndex][stat] + 1,
      };
      return newPlayers;
    });
  };

  return (
    <div className='w-full'>
      <div className="flex-row items-center justify-center pl-4 pt-2">
        New Tournament
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Win</TableHead>
            <TableHead>Loose</TableHead>
            <TableHead>Draw</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playerStats.map((player) => (
            <TableRow key={player.name}>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell className="font-medium">{player.win}</TableCell>
              <TableCell className="font-medium">{player.loose}</TableCell>
              <TableCell className="font-medium">{player.draw}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const StyledCard: FC<PropsWithChildren> = ({ children }) => (
  <Card className="flex min-h-16 w-full flex-col items-center justify-center">
    {children}
  </Card>
);

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
      ></CarouselContainer>
    </div>
  );
}

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
