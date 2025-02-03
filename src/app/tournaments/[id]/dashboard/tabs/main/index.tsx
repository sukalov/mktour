'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import ActionButton from '@/app/tournaments/[id]/dashboard/tabs/main/action-button';
import TournamentInfoList from '@/app/tournaments/[id]/dashboard/tabs/main/tournament-info-card';
import Center from '@/components/center';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC, useContext } from 'react';

const Main = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { data, isLoading } = useTournamentInfo(tournamentId);
  const { status } = useContext(DashboardContext);

  if (isLoading) return <LoadingElement />;
  if (!data) return <Center>no data</Center>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="truncate text-4xl font-bold whitespace-break-spaces">
        {data.tournament.title}
      </div>
      <TournamentInfoList />
      {/* here is place to chose number of rounds in swiss */}
      <ActionButton status={status} tournament={data.tournament} />
    </div>
  );
};

export const LoadingElement = () => {
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

export const InfoItem: FC<{
  icon: FC<{ className?: string }>;
  value: string | number | null | undefined;
  href?: string;
}> = ({ icon: Icon, value, href }) => (
  <div className="flex gap-2">
    <Icon />
    {!href ? (
      <span>{value}</span>
    ) : (
      <Link
        href={href!}
        className="underline underline-offset-4 hover:opacity-75"
      >
        {value}
      </Link>
    )}
  </div>
);

export default Main;
