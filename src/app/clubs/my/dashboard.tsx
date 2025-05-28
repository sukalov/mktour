'use client';

import { mockClubNotifications } from '@/app/clubs/my/(tabs)/inbox';
import ClubSelect from '@/app/clubs/my/club-select';
import { ClubDashboardContext } from '@/app/clubs/my/dashboard-context-club';
import ClubDashboardTabList from '@/app/clubs/my/dashboard-tab-list';
import { ClubDashboardTab, ClubTabProps, tabMap } from '@/app/clubs/my/tabMap';
import Loading from '@/app/loading';
import Empty from '@/components/empty';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import SwipeHandlerProvider from '@/components/swipe-handler-provider';
import { useTranslations } from 'next-intl';
import { Dispatch, FC, SetStateAction, useState } from 'react';

const MOCK = true;

export default function Dashboard({ userId }: { userId: string }) {
  const t = useTranslations('Club.Dashboard');
  const { data, isLoading } = useUser();
  const [tab, setTab] = useState<ClubDashboardTab>('main');
  const ActiveTab: FC<ClubTabProps> = tabMap[tab];
  const tabs = Object.keys(tabMap) as ClubDashboardTab[];
  const indexOfTab = tabs.indexOf(tab);
  const notificationsDb = useClubNotifications(data?.selected_club || '');

  const notifications = MOCK ? mockClubNotifications : notificationsDb;

  if (!data && isLoading) return <Loading />;
  if (!data) return <Empty>{t('no data')}</Empty>;

  return (
    <SwipeHandlerProvider
      handleSwipe={(dir) => handleSwipe(dir, indexOfTab, tabs, setTab)}
    >
      <ClubDashboardContext.Provider value={notifications}>
        <div className="fixed top-14 w-full">
          <ClubDashboardTabList activeTab={tab} setTab={setTab} />
          <ClubSelect user={data} />
        </div>
        <div className="mk-container pt-20">
          <ActiveTab selectedClub={data.selected_club} userId={userId} />
        </div>
      </ClubDashboardContext.Provider>
    </SwipeHandlerProvider>
  );
}

const handleSwipe = (
  direction: string,
  indexOfTab: number,
  tabs: ClubDashboardTab[],
  setTab: Dispatch<SetStateAction<ClubDashboardTab>>,
) => {
  let newIndex;
  if (direction === 'right') {
    newIndex = indexOfTab > 0 ? indexOfTab - 1 : tabs.length - 1;
  } else if (direction === 'left') {
    newIndex = indexOfTab < tabs.length - 1 ? indexOfTab + 1 : 0;
  } else return;

  setTab(tabs[newIndex]);
};
