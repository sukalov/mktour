import { useTRPC } from '@/components/trpc/client';
import { SearchParamsModel } from '@/server/api/routers/search';
import { useQuery } from '@tanstack/react-query';

export const useSearchQuery = (params: SearchParamsModel) => {
  const trpc = useTRPC();
  return useQuery(trpc.search.queryOptions(params));
};
