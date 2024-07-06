'use client';

import SkeletonList from '@/components/skeleton-list';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getClubTournaments } from '@/lib/actions/get-club-tournaments';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function ClubDashboardTournaments() {
  const { data, isLoading, isError, failureReason } = useQuery({
    queryKey: ['tournaments'],
    // queryFn: async () => {
    //   const res = await fetch('https://lichess.org/api/user/sukalov');
    //   return await res.json()
    // },
    queryFn: () => getClubTournaments(),
  });

  if (isLoading) return <SkeletonList length={4} />;
  if (isError) return <p className="w-full">{failureReason?.message}</p>;
  return (
    <div className="mb-2 flex flex-col gap-2">{data?.map(TournamentItem)}</div>
  );
}

const TournamentItem = (props: DatabaseTournament) => {
  const details = [props.type, props.format, props.date];

  const description = details.map((detail, i) => {
    const separator = i === details.length - 1 ? '' : '|';
    return <span key={i}>{`${detail} ${separator}`}</span>;
  });

  return (
    <Link
      key={props.id}
      href={`/tournament/${props.id}`}
      className="flex w-full flex-col"
    >
      <Card>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription className="flex gap-2">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
