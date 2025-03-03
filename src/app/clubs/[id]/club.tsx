'use client';

import ClubCard, { ClubProps } from '@/app/clubs/club-card';
import ClubDashboardTournaments from '@/app/clubs/my/(tabs)/tournaments';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const ClubPage: FC<ClubProps> = ({ club }) => {
  const t = useTranslations();
  return (
    <div className="space-y-4 p-4">
      <ClubCard club={club} />
      <p>{t('Club.Page.tournaments')}</p>
      <ClubDashboardTournaments selectedClub={club.id} userId="" />
    </div>
  );
};

export default ClubPage;
