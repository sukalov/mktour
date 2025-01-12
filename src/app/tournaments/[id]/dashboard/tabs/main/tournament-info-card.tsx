import {
    InfoItem,
    LoadingElement,
} from '@/app/tournaments/[id]/dashboard/tabs/main';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Card } from '@/components/ui/card';
import {
    CalendarDays,
    Clock,
    Dices,
    icons,
    NotebookPen,
    UserRound,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { FC } from 'react';
import { toast } from 'sonner';

const TournamentInfoList = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTournamentInfo(tournamentId);
  const t = useTranslations('MakeTournament');
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
  const decapitalizedWeekday =
    formattedDate.charAt(0).toLowerCase() + formattedDate.slice(1);

  return (
    <>
      <div className="truncate text-4xl font-bold whitespace-break-spaces">
        {data.tournament.title}
      </div>
      <Card className="items-left flex w-full flex-col gap-8 p-4 px-8">
        <InfoItem icon={NotebookPen} value={data.club?.name} />
        <InfoItem icon={UserRound} value={t(`Types.${data.tournament.type}`)} />
        <InfoItem icon={Dices} value={t(data.tournament.format)} />
        <InfoItem icon={CalendarDays} value={decapitalizedWeekday} />
        {formattedStartedAt && (
          <InfoItem
            icon={getClockIcon(data.tournament.started_at!)}
            value={formattedStartedAt}
          />
        )}
      </Card>
    </>
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

export default TournamentInfoList;
