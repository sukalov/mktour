'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import ResetTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/reset-tournament-button';
import TournamentInfoList from '@/app/tournaments/[id]/dashboard/tabs/main/tournament-info-card';
import useTournamentStart from '@/components/hooks/mutation-hooks/use-tournament-start';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { CirclePlay, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FC, useContext } from 'react';

const Main = () => {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { data } = useTournamentInfo(tournamentId);
  const { data: players } = useTournamentPlayers(tournamentId);
  const { sendJsonMessage } = useContext(DashboardContext);
  const queryClient = useQueryClient();

  const startTournamentMutation = useTournamentStart(queryClient, {
    tournamentId,
    sendJsonMessage,
  });
  const { status } = useContext(DashboardContext);
  const t = useTranslations('Tournament.Main');

  const handleClick = () => {
    startTournamentMutation.mutate({ started_at: new Date(), tournamentId });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <TournamentInfoList />
      {/* here is place to chose number of rounds in swiss */}

      {status !== 'organizer' ? null : !data?.tournament.started_at ? (
        <Button
          disabled={
            !players || players?.length < 2 || startTournamentMutation.isPending
          }
          onClick={handleClick}
          size="lg"
        >
          {startTournamentMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <CirclePlay />
          )}
          &nbsp;
          {t('start tournament')}
        </Button>
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
