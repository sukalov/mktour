'use client';

import { Card } from '@/components/ui/card';
import {
  Carousel,
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
import { Tabs } from '@/components/ui/tabs';
import { FC, PropsWithChildren, useState } from 'react';

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

const CarouselContainer = () => {
  <Carousel>
    <CarouselContent>
      <CarouselItem></CarouselItem>
    </CarouselContent>
  </Carousel>;
};

function TournamentTable() {
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
    <Table>
      <TableHeader>
        <div className="flex-row items-center justify-center">
          Tournament Stats
        </div>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Win</TableHead>
          <TableHead>Loose</TableHead>
          <TableHead>Draw</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playerStats.map((player, index) => (
          <TableRow key={player.name}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell className="font-medium">{player.win}</TableCell>
            <TableCell className="font-medium">{player.loose}</TableCell>
            <TableCell className="font-medium">{player.draw}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const StyledCard: FC<PropsWithChildren> = ({ children }) => (
  <Card style={{ margin: '1rem', padding: '1rem' }}>{children}</Card>
);

export default function Main() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>
          <Tabs></Tabs>
          <StyledCard>
            <TournamentTable />
          </StyledCard>
        </CarouselItem>
        <CarouselItem>
          <StyledCard>Brackets</StyledCard>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
