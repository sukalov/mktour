import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FC, useState } from 'react';

const TournamentTable: FC<PlayersProps> = ({ players }) => {
  const [playerStats, setPlayerStats] = useState(players);
  console.log(players);

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
    <div className="w-full">
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
          {playerStats.map((player: any) => (
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

export default TournamentTable;

type Player = {
  name: string;
  win: number;
  loose: number;
  draw: number;
}

type PlayersProps = {
  players: Player[];
}
