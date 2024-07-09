'use client';

import Empty from '@/components/empty';
import { useClubTournaments } from '@/components/hooks/query-hooks/use-club-tournaments';
import SkeletonList from '@/components/skeleton-list';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubDashboardTournaments: FC<{ selectedClub: string }> = ({
  selectedClub,
}) => {
  const { data, isLoading, isError, failureReason } =
    useClubTournaments(selectedClub);

  const t = useTranslations('Empty');

  if (isLoading) return <SkeletonList length={4} />;
  if (!data || !data.length) return <Empty>{t('tournaments')}</Empty>;
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

export default ClubDashboardTournaments;
