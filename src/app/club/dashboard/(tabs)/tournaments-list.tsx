

import { ClubTabProps } from '@/app/club/dashboard/dashboard';
import Empty from '@/components/empty';
import { useClubTournaments } from '@/components/hooks/query-hooks/use-club-tournaments';
import SkeletonList from '@/components/skeleton-list';
import TournamentItemIteratee from '@/components/tournament-item';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const ClubDashboardTournaments: FC<ClubTabProps> = ({
  selectedClub,
}) => {
  const { data, isLoading, isError, failureReason } = useClubTournaments(
    selectedClub,
  );

  const t = useTranslations('MakeTournament');

  if (!data && isLoading) return <SkeletonList length={4} />;
  if (!data || !data.length) return <Empty>{t('no data')}</Empty>;
  if (isError) return <p className="w-full">{failureReason?.message}</p>;
  return (
    <div className="mb-2 flex flex-col gap-2">{data.map(TournamentItemIteratee)}</div>
  );
};

export default ClubDashboardTournaments;
