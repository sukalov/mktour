import { Card, CardTitle } from '@/components/ui/card';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { DatabaseTournament } from '@/server/db/schema/tournaments';
import { Dot } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const TournamentItem = ({ club, tournament }: Props) => {
  const { date, type, format, id, title } = tournament;
  const locale = useLocale();
  const localizedDate = new Date(date).toLocaleDateString([locale]);
  const t = useTranslations('MakeTournament');
  const details = [t(`Types.${type}`), t(format), localizedDate];

  const description = details.map((detail, i) => {
    const separator = i !== details.length - 1 && (
      <div className="relative inline max-h-4 w-4">
        <Dot className="absolute top-0 bottom-0 m-auto w-full" />
      </div>
    );
    return (
      <span key={i} className="flex items-center">
        {detail}
        {separator}
      </span>
    );
  });

  return (
    <Link key={id} href={`/tournaments/${id}`}>
      <Card className="mk-card flex flex-col">
        <CardTitle className="text-sm">{title}</CardTitle>
        {club && (
          <span className="text-muted-foreground text-2xs">{club.name}</span>
        )}
        <div className="text-muted-foreground flex text-xs">{description}</div>
      </Card>
    </Link>
  );
};

const TournamentItemIteratee = ({ club, tournament }: Props) => (
  <TournamentItem tournament={tournament} club={club} />
);

type Props = { tournament: DatabaseTournament; club?: DatabaseClub };

export default TournamentItemIteratee;
