import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { Card } from '@/components/ui/card';
import { CalendarDays, Dices, UserRound } from 'lucide-react';
import { FC, ReactNode, useContext } from 'react';

const Main = () => {
  const { tournament } = useContext(TournamentContext);

  return (
    <div className="px-4">
      <Card className="flex flex-col items-center gap-8 p-4">
        <InfoItem icon={<UserRound />} value={tournament?.type} />
        <InfoItem icon={<Dices />} value={tournament?.format} />
        <InfoItem icon={<CalendarDays />} value={tournament?.date} />
      </Card>
    </div>
  );
};

const InfoItem: FC<{ icon: ReactNode; value: string | number | null }> = ({
  icon,
  value,
}) => (
  <div className="flex gap-2">
    {icon}
    {value}
  </div>
);

export default Main;
