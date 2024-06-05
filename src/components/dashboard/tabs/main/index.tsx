import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { CalendarDays, Dices, NotebookPen, UserRound } from 'lucide-react';
import { FC, ReactNode } from 'react';

const Main = () => {
  const { title, type, format, date, isLoading, organizer } =
    useTournamentStore();

  if (isLoading) return <LoadingElement />;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="truncate whitespace-break-spaces text-4xl font-bold">
        {title}
      </div>
      <Card className="items-left flex w-full flex-col gap-8 p-4 pl-[15%]">
        <InfoItem icon={<NotebookPen />} value={organizer.name} />
        <InfoItem icon={<UserRound />} value={type} />
        <InfoItem icon={<Dices />} value={format} />
        <InfoItem icon={<CalendarDays />} value={date} />
      </Card>
      {/* here is place to chose number of rounds in swiss */}
      <Button onClick={() => console.log('tournament started')}>
        start tournament
      </Button>
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
      <Card className="items-left flex w-full flex-col gap-8 p-4 px-[15%]">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </Card>
    </div>
  );
};

export default Main;
