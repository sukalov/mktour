import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const trpc = useTRPC();
  return useQuery(trpc.users.userAuth.queryOptions());
};
