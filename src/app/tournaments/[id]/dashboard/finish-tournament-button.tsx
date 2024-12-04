import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function FinishTournamentButton({
  roundNumber,
}: {
  roundNumber: number;
}) {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const t = useTranslations('Tournament.Main');
  const { data: round } = useTournamentRoundGames({
    tournamentId,
    roundNumber,
  });

  if (!round) return;

  const ongoingGames = round.reduce(
    (acc, current) => (current.result === null ? acc + 1 : acc),
    0,
  );
  if (ongoingGames === 0) {
    return (
      <Button className="w-full">
        <Save />
        &nbsp;
        {t('finish tournament')}
      </Button>
    );
  }
  return;
}
