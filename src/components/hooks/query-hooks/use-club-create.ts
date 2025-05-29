import { useTRPC } from '@/components/trpc/client';
import { useMutation } from '@tanstack/react-query';

export const useClubCreate = () => {
  const trpc = useTRPC();
  return useMutation(trpc.club.create.mutationOptions({}));
};
