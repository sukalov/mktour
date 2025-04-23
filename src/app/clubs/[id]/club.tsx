'use client';

import { ClubProps } from '@/app/clubs/club-card';
import ClubDashboardTournaments from '@/app/clubs/my/(tabs)/tournaments';
import LichessLogo from '@/components/ui/lichess-logo';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubPage: FC<ClubProps> = ({ club }) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-4 p-4">
      <ClubInfo club={club} />
      <p className="px-4">{t('Club.Page.tournaments')}</p>
      <ClubDashboardTournaments selectedClub={club.id} userId="" />
    </div>
  );
};

const ClubInfo: FC<ClubProps> = ({ club }) => {
  const t = useTranslations('Club');
  const locale = useLocale();
  return (
    <div className="px-4">
      <p className="text- font-bold">{club.name}</p>
      {club.lichess_team && (
        <Link
          href={`https://lichess.org/team/${club.lichess_team}`}
          target="_blank"
          className="size-4"
        >
          <LichessLogo />
        </Link>
      )}
      {club.description && (
        <span className="text-muted-foreground text-sm">
          {club.description || t('Page.no description')}
        </span>
      )}

      <p className="text-muted-foreground text-xs">
        {club.created_at &&
          t('Page.createdAt', {
            date: club.created_at!.toLocaleDateString(locale, {
              dateStyle: 'long',
            }),
          })}
      </p>
    </div>
  );
};

export default ClubPage;
