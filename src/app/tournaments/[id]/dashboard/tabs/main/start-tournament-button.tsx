import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentStart from '@/components/hooks/mutation-hooks/use-tournament-start';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { CirclePlay, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

export default function StartTournamentButton() {
  const queryClient = useQueryClient();
  const { id: tournamentId } = useParams<{ id: string }>();
  const { sendJsonMessage } = useContext(DashboardContext);
  const { data: players } = useTournamentPlayers(tournamentId);
  const startTournamentMutation = useTournamentStart(queryClient, {
    tournamentId,
    sendJsonMessage,
  });
  const t = useTranslations('Tournament.Main');

  const handleClick = () => {
    if (!players) {
      throw new Error('NO_PLAYERS_DATA');
    }
    const rounds_number =
      players.length % 2 == 0 ? players.length - 1 : players.length;
    startTournamentMutation.mutate({
      started_at: new Date(),
      tournamentId,
      rounds_number,
    });
  };

  return (
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
  );
}
