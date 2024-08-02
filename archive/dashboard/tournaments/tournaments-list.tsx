'use client';

import Loading from '@/app/loading';
import { useClubTournaments } from '@/components/hooks/query-hooks/use-club-tournaments';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import SkeletonList from '@/components/skeleton-list';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import Link from 'next/link';
import { FC } from 'react';

const TournamentsList: FC<{ userId: string }> = ({ userId }) => {
  const user = useUser(userId);
  const { data, isLoading, isError, failureReason } = useClubTournaments(
    user!.data!.selected_club,
  );
  if (!user || !user.data) return <Loading />;
  if (isLoading) return <SkeletonList length={4} />;
  if (isError) return <p className="w-full">{failureReason?.message}</p>;
  return (
    <div className="mb-2 flex flex-col gap-2">{data?.map(TournamentItem)}</div>
  );
};

const TournamentItem = (props: DatabaseTournament) => {
  const details = [props.type, props.format, props.date];

  const description = details.map((detail, i) => {
    const separator = i === details.length - 1 ? '' : '|';
    return <span key={i}>{`${detail} ${separator}`}</span>;
  });

  return (
    <Link
      key={props.id}
      href={`/tournaments/${props.id}`}
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

export default TournamentsList;
