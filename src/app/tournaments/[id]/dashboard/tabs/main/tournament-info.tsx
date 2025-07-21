import {
  InfoItem,
  LoadingElement,
} from '@/app/tournaments/[id]/dashboard/tabs/main';
import Winners from '@/app/tournaments/[id]/dashboard/tabs/main/winners';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { CalendarDays, Dices, HomeIcon, UserRound } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
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

  const dateArr = data.tournament.date.split('-');
  const formattedDate = new Date(
    Number(dateArr[0]),
    Number(dateArr[1]) - 1, // month is 0-indexed 2025-01-01 is (2025, 0, 1) = first of january
    Number(dateArr[2]),
  ).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long',
  });
  const decapitalizedWeekday =
    formattedDate.charAt(0).toLowerCase() + formattedDate.slice(1);

  return (
    <div className="p-mk flex flex-col gap-2">
      <InfoItem
        icon={HomeIcon}
        value={data.club?.name}
        href={`/clubs/${data.club?.id}`}
      />
      <InfoItem icon={UserRound} value={t(`Types.${data.tournament.type}`)} />
      <InfoItem icon={Dices} value={data.tournament.format} format={true} />
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
    </div>
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

export default TournamentInfoList;
