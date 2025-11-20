import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
  const trpc = useTRPC();
  return useQuery(trpc.auth.info.queryOptions());
};
