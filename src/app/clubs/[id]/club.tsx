'use client';

import { ClubProps } from '@/app/clubs/club-card';
import ClubPlayersList from '@/app/clubs/my/(tabs)/players';
import ClubDashboardTournaments from '@/app/clubs/my/(tabs)/tournaments';
import FormattedMessage from '@/components/formatted-message';
import LichessLogo from '@/components/ui/lichess-logo';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC, useState } from 'react';

const ClubPage: FC<ClubProps> = ({ club }) => {
  const [tab, setTab] = useState(0);
  const props = { selectedClub: club.id, userId: '' };
  const Component: FC<typeof props> =
    tab > 0 ? ClubPlayersList : ClubDashboardTournaments;

  return (
    <div className="mk-container flex flex-col gap-2">
      <div className="flex flex-col gap-2 px-2">
        <ClubInfo club={club} />
      </div>
      <div className={`flex ${tab === 1 && 'flex-row-reverse'} px-2`}>
        <span
          className={`text-muted grow ${tab === 0 && 'text-primary underline underline-offset-2'}`}
          onClick={() => setTab(0)}
        >
          <FormattedMessage id="Menu.tournaments" />
        </span>
        <span
          className={`text-muted grow ${tab > 0 && 'text-primary underline underline-offset-2'}`}
          onClick={() => setTab(1)}
        >
          <FormattedMessage id="Club.Dashboard.players" />
        </span>
      </div>
      <Component {...props} />
    </div>
  );
};

const ClubInfo: FC<ClubProps> = ({ club }) => {
  const t = useTranslations('Club');
  const locale = useLocale();
  return (
    <div>
      <p className="text-2xl font-bold">{club.name}</p>
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
