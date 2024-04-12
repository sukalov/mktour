import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { Card } from '@/components/ui/card';
import { CalendarDays, Dices, UserRound } from 'lucide-react';
import { useContext } from 'react';

const Main = () => {
  const { tournament } = useContext(TournamentContext);

  return (
    <div className="px-4">
      <Card className="flex flex-col items-center gap-8 p-4">
        <div className="flex gap-2">
          <UserRound />
          {tournament?.type}
        </div>
        <div className="flex gap-2">
          <Dices />
          {tournament?.format}
        </div>
        <div className="flex gap-2">
          <CalendarDays />
          {tournament?.date}
        </div>
      </Card>
    </div>
  );
};

export default Main;
