'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentSetStatus from '@/components/hooks/mutation-hooks/use-tournament-set-status';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  Clock,
  Dices,
  icons,
  NotebookPen,
  UserRound,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FC, useContext } from 'react';
import { toast } from 'sonner';

const Main = () => {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { data, isLoading, isError } = useTournamentInfo(tournamentId);
  const {
    data: players,
    isLoading: isPlayersLoading,
    isError: isPlayersError,
  } = useTournamentPlayers(tournamentId);
  const { sendJsonMessage } = useContext(DashboardContext);
  const queryClient = useQueryClient();

  const tournamentStatusMutation = useTournamentSetStatus(queryClient, {
    tournamentId,
    sendJsonMessage,
  });
  const { status } = useContext(DashboardContext);
  const t = useTranslations('Tournament.Main');
  const locale = useLocale();

  const handleClick = () => {
    tournamentStatusMutation.mutate({ started_at: new Date(), tournamentId });
  };

  if (isLoading || isPlayersLoading) return <LoadingElement />;
  if (isError || isPlayersError) {
    toast.error("couldn't get tournament info from server", {
      id: 'query-info',
      duration: 3000,
    });
    return <LoadingElement />;
  }
  if (!data) return 'tournament info is `undefined` somehow';

  const formattedStartedAt = data.tournament.started_at?.toLocaleTimeString(
    locale,
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );
  const formattedDate = new Date(data.tournament.date).toLocaleDateString(
    locale,
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
    },
  );
  const decapitalizedWeekday = formattedDate.charAt(0).toLowerCase() + formattedDate.slice(1);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="truncate whitespace-break-spaces text-4xl font-bold">
        {data.tournament.title}
      </div>
      <Card className="items-left flex w-full flex-col gap-8 p-4 px-8">
        <InfoItem icon={NotebookPen} value={data.club?.name} />
        <InfoItem icon={UserRound} value={data.tournament.type} />
        <InfoItem icon={Dices} value={data.tournament.format} />
        <InfoItem icon={CalendarDays} value={decapitalizedWeekday} />
        {formattedStartedAt && (
          <InfoItem
            icon={getClockIcon(data.tournament.started_at!)}
            value={formattedStartedAt}
          />
        )}
      </Card>
      {/* here is place to chose number of rounds in swiss */}

      {status !== 'organizer' ? (
        <></>
      ) : !data.tournament.started_at ? (
        <Button
          disabled={!players || players?.length < 2}
          onClick={handleClick}
          size="lg"
        >
          {t('start tournament')}
        </Button>
      ) : (
        <Button // FIXME dev-tool
          onClick={() =>
            tournamentStatusMutation.mutate({ started_at: null, tournamentId })
          }
        >
          <p>
            <strong>DEV:</strong> reset started at
          </p>
        </Button>
      )}
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

const getClockIcon = (time: Date | null | undefined): FC => {
  if (!time) return Clock;

  let hour = time.getHours();
  const minutes = time.getMinutes();
  if (minutes >= 30) {
    hour = hour + 1;
  }
  hour = hour % 12;
  const clockIcon = `Clock${hour === 0 ? '12' : hour}` as keyof typeof icons;

  return icons[clockIcon];
};

export default Main;
