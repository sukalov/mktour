'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import ClubPlayersList from '@/app/clubs/players';
import ClubDashboardTournaments from '@/app/clubs/tournaments';
import FormattedMessage from '@/components/formatted-message';
import { useUserSelectClub } from '@/components/hooks/mutation-hooks/use-user-select-club';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Button } from '@/components/ui/button';
import LichessLogo from '@/components/ui/lichess-logo';
import { DatabaseClub, StatusInClub } from '@/server/db/schema/clubs';
import { IntlMessageId } from '@/types/messages';
import { useQueryClient } from '@tanstack/react-query';
import { Home } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC, useState } from 'react';

const ClubPage: FC<{
  club: DatabaseClub;
  statusInClub: StatusInClub | undefined;
  userId: string;
}> = ({ club, statusInClub, userId }) => {
  const [tab, setTab] = useState(0);
  const props = { selectedClub: club.id, userId, statusInClub };
  const Component: FC<typeof props> = tabArray[tab].component;

  return (
    <div className="mk-container flex flex-col gap-2">
      <ClubInfo club={club} statusInClub={statusInClub} />
      <div className="grid grid-cols-2 px-2">
        {tabArray.map(({ id }, i) => (
          <span
            key={id}
            className={`text-muted-foreground grow cursor-pointer text-center ${
              tab === i && 'text-primary underline underline-offset-2'
            }`}
            onClick={() => setTab(i)}
          >
            <FormattedMessage id={id} />
          </span>
        ))}
      </div>
      <Component {...props} />
    </div>
  );
};

const ClubInfo: FC<{
  club: DatabaseClub;
  statusInClub: StatusInClub | undefined;
}> = ({ club, statusInClub }) => {
  const t = useTranslations('Club');
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { mutate } = useUserSelectClub(queryClient);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <p className="px-mk text-2xl font-bold">{club.name}</p>
        {user && statusInClub && (
          <Button className="px-mk h-full" variant="outline">
            <Link // FIXME this has lag in changing selected club
              className="gap-mk flex h-full w-full items-center text-left"
              prefetch={false}
              onNavigate={() => {
                mutate({
                  userId: user.id,
                  clubId: club.id,
                });
              }}
              href="/clubs/my"
            >
              <Home />
              {t('dashboard')}
            </Link>
          </Button>
        )}
      </div>
      <div className="px-3">
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
              date: club.created_at.toLocaleDateString(locale, {
                dateStyle: 'long',
              }),
            })}
        </p>
      </div>
    </div>
  );
};

const tabArray: Tab[] = [
  {
    id: 'Menu.tournaments',
    component: ClubDashboardTournaments,
  },
  {
    id: 'Club.Dashboard.players',
    component: ClubPlayersList,
  },
];

type Tab = {
  id: IntlMessageId;
  component: FC<ClubTabProps>;
};

export default ClubPage;
