import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const trpc = useTRPC();
  return useQuery(trpc.user.auth.queryOptions());
};
