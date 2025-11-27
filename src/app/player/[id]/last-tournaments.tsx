import FormattedMessage from '@/components/formatted-message';
import { Card } from '@/components/ui/card';
import { PlayerToTournamentModel } from '@/server/db/zod/tournaments';
import Link from 'next/link';
import { FC } from 'react';

const LastTournaments: FC<{ tournaments: PlayerToTournamentModel[] }> = ({
  tournaments,
}) => {
  if (!tournaments) return null;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="pl-mk font-semibold">
        <FormattedMessage id="Player.last tournaments" />
      </h2>
      <div className="mk-list">
        {tournaments.map((tournament) => (
          <Card key={tournament?.tournament?.id} className="mk-card">
            <Link href={`/tournaments/${tournament?.tournament?.id}`}>
              {tournament.tournament?.title}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LastTournaments;
