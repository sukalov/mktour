import { useTRPC } from '@/components/trpc/client';
import { useMutation } from '@tanstack/react-query';

export const useTournamentCreate = () => {
  const trpc = useTRPC();
  return useMutation(trpc.tournament.create.mutationOptions());
};
