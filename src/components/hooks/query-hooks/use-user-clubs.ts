import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useUserClubs = (userId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.user.clubs.queryOptions({ userId }));
};

export const useAuthClubs = () => {
  const trpc = useTRPC();
  return useQuery(trpc.user.authClubs.queryOptions());
};
