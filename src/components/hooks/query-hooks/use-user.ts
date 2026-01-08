import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucia';

export const useAuth = (initialData?: User | null) => {
  const trpc = useTRPC();
  return useQuery({ ...trpc.auth.info.queryOptions(), initialData });
};
