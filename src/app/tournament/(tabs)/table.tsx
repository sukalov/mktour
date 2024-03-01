import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FC, useContext } from 'react';

const TournamentTable: FC = () => {
  const { players } = useContext(TournamentContext)
  return (
    <div className="w-full m-0">
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
