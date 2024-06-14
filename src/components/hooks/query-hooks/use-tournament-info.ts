import { getTournamentInfo } from "@/lib/actions/tournament-managing";
import { useQuery } from "@tanstack/react-query";

export const useTournamentInfo = (id: string) =>
  useQuery({
    queryKey: ['tournament', id],
    queryFn: () => getTournamentInfo(id),
    staleTime: Infinity
  });
