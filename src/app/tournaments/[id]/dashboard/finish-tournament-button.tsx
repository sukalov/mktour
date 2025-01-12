import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentFinish from '@/components/hooks/mutation-hooks/use-tournament-finish';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

export default function FinishTournamentButton({
  lastRoundNumber,
}: {
  lastRoundNumber: number;
}) {
  const queryClient = useQueryClient();
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { sendJsonMessage } = useContext(DashboardContext);
  const t = useTranslations('Tournament.Main');
  const { data: round } = useTournamentRoundGames({
    tournamentId,
    roundNumber: lastRoundNumber,
  });

  const { mutate } = useTournamentFinish(queryClient, {
    tournamentId,
    sendJsonMessage,
  });

  if (!round) return;

  const ongoingGames = round.reduce(
    (acc, current) => (current.result === null ? acc + 1 : acc),
    0,
  );
  if (ongoingGames === 0) {
    return (
      <Button
        className="w-full"
        onClick={() => mutate({ tournamentId, closed_at: new Date() })}
      >
        <Save />
        &nbsp;
        {t('finish tournament')}
      </Button>
    );
  }
  return;
}
