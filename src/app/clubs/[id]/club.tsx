'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import ClubPlayersList from '@/app/clubs/players';
import ClubDashboardTournaments from '@/app/clubs/tournaments';
import FormattedMessage, {
  IntlMessageId,
} from '@/components/formatted-message';
import { useUserSelectClub } from '@/components/hooks/mutation-hooks/use-user-select-club';
import { useAuth } from '@/components/hooks/query-hooks/use-user';
import LichessLogo from '@/components/ui-custom/lichess-logo';
import { Button } from '@/components/ui/button';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { StatusInClub } from '@/server/db/zod/enums';
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
  const { data: user } = useAuth();
  const { mutate } = useUserSelectClub(queryClient);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-row items-start justify-between gap-2 sm:items-center">
        <div className="flex flex-row items-center gap-2">
          <p className="px-mk text-2xl font-bold">{club.name}</p>
          {club.lichessTeam && (
            <Link
              href={`https://lichess.org/team/${club.lichessTeam}`}
              target="_blank"
            >
              <LichessLogo className="size-4" />
            </Link>
          )}
        </div>
        {user && statusInClub && (
          <Button
            className="gap-mk flex h-full items-center justify-center text-left"
            variant="outline"
            asChild
          >
            <Link // FIXME this has lag in changing selected club
              className="flex gap-2"
              prefetch={false}
              onNavigate={() => {
                mutate({
                  clubId: club.id,
                });
              }}
              href="/clubs/my"
            >
              <Home />
              <p className="hidden sm:block">{t('dashboard')}</p>
            </Link>
          </Button>
        )}
      </div>
      <div className="px-mk">
        {club.description && (
          <span className="text-muted-foreground text-sm">
            {club.description || t('Page.no description')}
          </span>
        )}
        <p className="text-muted-foreground text-xs">
          {club.createdAt &&
            t('Page.createdAt', {
              date: club.createdAt.toLocaleDateString(locale, {
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
