import { DashboardContext } from '@/app/tournament/[id]/dashboard-context';
import { Card } from '@/components/ui/card';
import { CalendarDays, Dices, UserRound } from 'lucide-react';
import { FC, ReactNode, useContext } from 'react';

const Main = () => {
  const { tournament } = useContext(DashboardContext);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="truncate whitespace-break-spaces text-4xl font-bold">
        {tournament?.title}
      </div>
      <Card className="flex w-full flex-col items-center gap-8 p-4">
        <InfoItem icon={<UserRound />} value={tournament?.type} />
        <InfoItem icon={<Dices />} value={tournament?.format} />
        <InfoItem icon={<CalendarDays />} value={tournament?.date} />
      </Card>
    </div>
  );
};

const InfoItem: FC<{
  icon: ReactNode;
  value: string | number | null | undefined;
}> = ({ icon, value }) => (
  <div className="flex gap-2">
    {icon}
    {value}
  </div>
);

export default Main;
