import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useTournamentRoundGames = ({
  tournamentId,
  roundNumber,
}: {
  tournamentId: string;
  roundNumber: number;
}) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.tournament.roundGames.queryOptions({
      tournamentId,
      roundNumber,
    }),
  );
};
