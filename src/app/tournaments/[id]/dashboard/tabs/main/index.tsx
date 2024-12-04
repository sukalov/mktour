'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import FinishTournamentButton from '@/app/tournaments/[id]/dashboard/finish-tournament-button';
import ResetTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/reset-tournament-button';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import TournamentInfoList from '@/app/tournaments/[id]/dashboard/tabs/main/tournament-info-card';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { FC, useContext } from 'react';

const Main = () => {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { data } = useTournamentInfo(tournamentId);
  const { status } = useContext(DashboardContext);

  if (!data) return <LoadingElement />;
  return (
    <div className="flex flex-col gap-4 p-4">
      <TournamentInfoList />
      {/* here is place to chose number of rounds in swiss */}

      {status !== 'organizer'
        ? null
        : data?.tournament.ongoing_round === data.tournament.rounds_number && (
            <FinishTournamentButton
              roundNumber={data.tournament.ongoing_round}
            />
          )}

      {status !== 'organizer' ? null : !data.tournament.started_at ? (
        <StartTournamentButton />
      ) : (
        <ResetTournamentButton />
      )}
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
  icon: FC;
  value: string | number | null | undefined;
}> = ({ icon: Icon, value }) => (
  <div className="flex gap-2">
    <Icon />
    {value}
  </div>
);

export default Main;
