import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

const useUserClubAffiliations = (clubId: string) => {
  const trpc = useTRPC();
  const authAffiliation = useQuery(
    trpc.club.authAffiliation.queryOptions({ clubId }),
  );

  return authAffiliation;
};

export default useUserClubAffiliations;
