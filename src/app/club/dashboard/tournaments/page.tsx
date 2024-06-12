'use client';

import { getClubTournaments } from '@/lib/actions/get-club-tournaments';
import { useQuery } from '@tanstack/react-query';

export default function ClubDashboardTournaments() {
  const data = useQuery({
    queryKey: ['tournaments'],
    // queryFn: async () => {
    //   const res = await fetch('https://lichess.org/api/user/sukalov');
    //   return await res.json()
    // },
    queryFn: () => getClubTournaments(),
  });

  if (data.isLoading) return <p>loading...</p>;
  if (data.isError)
    return <p className="w-full">{data?.failureReason?.message}</p>;
  return <pre>{JSON.stringify(data.data, null, 2)}</pre>;
}
