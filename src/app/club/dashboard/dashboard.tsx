'use client';

import ClubPlayersList from '@/app/club/dashboard/(tabs)/club-players-list';
import ClubSettings from '@/app/club/dashboard/(tabs)/club-settings';
import ClubInbox from '@/app/club/dashboard/(tabs)/inbox';
import ClubMain from '@/app/club/dashboard/(tabs)/main';
import ClubDashboardTournaments from '@/app/club/dashboard/(tabs)/tournaments-list';
import ClubSelect from '@/app/club/dashboard/club-select';
import ClubDashboardTabList from '@/app/club/dashboard/dashboard-tab-list';
import Loading from '@/app/loading';
import Empty from '@/components/empty';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
export default function Dashboard({ userId }: { userId: string }) {
  const t = useTranslations('Club.Dashboard');
  const { data, isLoading } = useUser(userId);
  const [tab, setTab] = useState<ClubDashboardTab>('main');
  const ActiveTab: FC<ClubTabProps> = tabMap[tab];

  if (!data && isLoading) return <Loading />;
  if (!data) return <Empty>{t('no data')}</Empty>;

  return (
    <div>
      <ClubDashboardTabList activeTab={tab} setTab={setTab} />
      <div className="pt-12">
        <div className="px-1">
          <ClubSelect user={data} />
        </div>
        <div className="p-2 pt-2">
          <ActiveTab selectedClub={data.selected_club} userId={userId} />
        </div>
      </div>
    </div>
  );
}

export const tabMap: Record<ClubDashboardTab, FC<ClubTabProps>> = {
  main: ClubMain,
  players: ClubPlayersList,
  tournaments: ClubDashboardTournaments,
  inbox: ClubInbox,
  settings: ClubSettings,
};

export type ClubDashboardTab =
  | 'main'
  | 'players'
  | 'tournaments'
  | 'inbox'
  | 'settings';

export type ClubTabProps = {
  selectedClub: string;
  userId: string;
  isInView?: boolean;
};
