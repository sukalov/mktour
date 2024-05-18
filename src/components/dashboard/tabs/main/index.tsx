import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { CalendarDays, Dices, UserRound } from 'lucide-react';
import { FC, ReactNode } from 'react';

const Main = () => {
  const { title, type, format, date, isLoading } = useTournamentStore();

  if (isLoading) return <LoadingElement />

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="truncate whitespace-break-spaces text-4xl font-bold">
        {title}
      </div>
      <Card className="flex w-full flex-col items-center gap-8 p-4">
        <InfoItem icon={<UserRound />} value={type} />
        <InfoItem icon={<Dices />} value={format} />
        <InfoItem icon={<CalendarDays />} value={date} />
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

const LoadingElement = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-10 w-full" />
      <Card className="flex w-full flex-col items-center gap-8 p-4">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-6 w-[250px]" />
      </Card>
    </div>
  );
};

export default Main;
