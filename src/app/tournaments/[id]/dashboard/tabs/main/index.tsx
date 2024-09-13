'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useGenerateRoundRobinRound from '@/components/hooks/mutation-hooks/use-tournament-generate-rr-round';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QueryClient } from '@tanstack/react-query';
import { CalendarDays, Dices, NotebookPen, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FC, ReactNode, useContext } from 'react';
import { toast } from 'sonner';

const Main = () => {
  const id = usePathname().split('/').at(-1) as string;
  const { data, isLoading, isError } = useTournamentInfo(id);
  const queryClient = new QueryClient();
  const { mutate, data: generatedRounds } = useGenerateRoundRobinRound(queryClient);
  const { userId } = useContext(DashboardContext)

  if (isLoading) return <LoadingElement />;
  if (isError) {
    toast.error("couldn't get tournament info from server", {
      id: 'query-info',
      duration: 3000,
    });
    return <LoadingElement />;
  }

  const onClick = () => {
    mutate({
        tournamentId: data?.tournament.id || '',
        roundNumber: data?.tournament.ongoing_round || 0,
        userId: userId || ''
      });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="truncate whitespace-break-spaces text-4xl font-bold">
        {data?.tournament.title}
      </div>
      <Card className="items-left flex w-full flex-col gap-8 p-4 px-8">
        <InfoItem icon={<NotebookPen />} value={data?.club?.name} />
        <InfoItem icon={<UserRound />} value={data?.tournament.type} />
        <InfoItem icon={<Dices />} value={data?.tournament.format} />
        <InfoItem icon={<CalendarDays />} value={data?.tournament.date} />
      </Card>
      {/* here is place to chose number of rounds in swiss */}
      <Button onClick={() => onClick()}>
        start tournament
      </Button>
    </div>
  );
};

export const InfoItem: FC<{
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
