import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { TournamentWithClub } from '@/lib/db/queries/get-tournaments-to-user-clubs-query';
import { Dot } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const TournamentItem = ({ club, tournament, showClubName }: Props) => {
  const { date, type, format, id, title } = tournament;
  const locale = useLocale();
  const localizedDate = new Date(date).toLocaleDateString([locale]);
  const t = useTranslations('MakeTournament');
  const details = [t(`Types.${type}`), t(format), localizedDate];

  const description = details.map((detail, i) => {
    const separator = i !== details.length - 1 && <Dot className="inline" />;
    return (
      <span key={i} className="flex items-center">
        {detail}
        {separator}
      </span>
    );
  });

  return (
    <Link key={id} href={`/tournaments/${id}`} className="flex w-full flex-col">
      <Card className="flex flex-col gap-3 p-3">
        <CardTitle className="text-md flex flex-col">
          <span>{title}</span>
          {showClubName && (
            <span className="text-muted text-xs">{club.name}</span>
          )}
        </CardTitle>
        <CardDescription className="flex text-xs">
          {description}
        </CardDescription>
      </Card>
    </Link>
  );
};

const TournamentItemIteratee = ({ club, tournament, showClubName }: Props) => (
  <TournamentItem
    tournament={tournament}
    club={club}
    showClubName={showClubName}
  />
);

type Props = TournamentWithClub & { showClubName: boolean | undefined };

export default TournamentItemIteratee;
