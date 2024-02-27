import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FC } from 'react';

const TournamentTable: FC<PlayersProps> = ({ players }) => {
  return (
    <div className="w-full">
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
          {players.map((player: any) => (
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
};

type PlayersProps = {
  players: Player[];
};
