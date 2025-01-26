import {
  InfoItem,
  LoadingElement,
} from '@/app/tournaments/[id]/dashboard/tabs/main';
import { Medal } from '@/app/tournaments/[id]/dashboard/tabs/table';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Card } from '@/components/ui/card';
import { TournamentInfo } from '@/types/tournaments';
import { CalendarDays, Dices, HomeIcon, UserRound } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

const TournamentInfoList = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTournamentInfo(tournamentId);
  const t = useTranslations('Tournament.Main');
  const locale = useLocale();

  if (isLoading) return <LoadingElement />;
  if (isError) {
    toast.error("couldn't get tournament info from server", {
      id: 'query-info',
      duration: 3000,
    });
    return <LoadingElement />;
  }
  if (!data) return 'tournament info is `undefined` somehow';

  // const formattedStartedAt = data.tournament.started_at?.toLocaleTimeString(
  //   locale,
  //   {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   },
  // );
  // const formattedClosedAt = data.tournament.closed_at?.toLocaleTimeString(
  //   locale,
  //   {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   },
  // );
  const formattedDate = new Date(data.tournament.date).toLocaleDateString(
    locale,
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
    },
  );
  const decapitalizedWeekday =
    formattedDate.charAt(0).toLowerCase() + formattedDate.slice(1);

  return (
    <Card className="items-left flex w-full flex-col gap-8 p-4 px-8">
      <InfoItem
        icon={HomeIcon}
        value={data.club?.name}
        href={`/clubs/${data.club?.id}`}
      />
      <InfoItem icon={UserRound} value={t(`Types.${data.tournament.type}`)} />
      <InfoItem icon={Dices} value={t(data.tournament.format)} />
      <InfoItem icon={CalendarDays} value={decapitalizedWeekday} />
      {/* {formattedStartedAt && (
        <InfoItem
          icon={getClockIcon(data.tournament.started_at!)}
          value={`${t('started at')} ${formattedStartedAt}`}
        />
      )}
      {formattedClosedAt && (
        <InfoItem
          icon={getClockIcon(data.tournament.closed_at!)}
          value={`${t('ended at')} ${formattedClosedAt}`}
        />
      )} */}
      <Winners {...data} />
    </Card>
  );
};

// const getClockIcon = (time: Date | null | undefined): FC => {
//   if (!time) return Clock;

//   let hour = time.getHours();
//   const minutes = time.getMinutes();
//   if (minutes >= 30) {
//     hour = hour + 1;
//   }
//   hour = hour % 12;
//   const clockIcon = `Clock${hour === 0 ? '12' : hour}` as keyof typeof icons;

//   return icons[clockIcon];
// };

const Winners: FC<TournamentInfo> = ({ tournament }) => {
  const { data: players } = useTournamentPlayers(tournament.id);
  const winners = players?.filter(({ place }) => place && place <= 3);
  const PlayerContainer: FC<PropsWithChildren> = ({ children }) => (
    <div className="flex items-center gap-2 truncate">{children}</div>
  );

  if (!winners || !tournament.closed_at) return null;
  return (
    <div className="flex flex-col gap-8 underline underline-offset-4">
      <PlayerContainer>
        <Medal className="size-6 bg-amber-300" />
        <Link href={`/player/${winners[0].id}`}> {winners[0].nickname}</Link>
      </PlayerContainer>
      <PlayerContainer>
        <Medal className="size-6 bg-gray-300" />
        <Link href={`/player/${winners[1].id}`}> {winners[1].nickname}</Link>
      </PlayerContainer>
      <PlayerContainer>
        <Medal className="size-6 bg-amber-700" />
        <Link href={`/player/${winners[2]?.id}`}>{winners[2]?.nickname}</Link>
      </PlayerContainer>
    </div>
  );
};

export default TournamentInfoList;
