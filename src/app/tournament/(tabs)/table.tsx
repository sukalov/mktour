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
import { useMediaQuery } from 'react-responsive';

const TournamentTable: FC = () => {
  const { players } = useContext(TournamentContext);
  const isMobile = useMediaQuery({ maxWidth: 500 });

  const tableResultTitles = ['Win', 'Loose', 'Draw'];

  const TableResultHeads = () => {
    const shortenTitle = (title: string) =>
      isMobile ? title.slice(0, 1) : title;
    return (
      <>
        {tableResultTitles.map((title) => (
          <TableHead key={title}>{shortenTitle(title)}</TableHead>
        ))}
      </>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableResultHeads />
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player: any) => (
          <TableRow key={player.name}>
            <TableCell className="font-small max-w-[200px] truncate">
              {player.name}
            </TableCell>
            <TableCell className="font-medium">{player.win}</TableCell>
            <TableCell className="font-medium">{player.loose}</TableCell>
            <TableCell className="font-medium">{player.draw}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TournamentTable;
