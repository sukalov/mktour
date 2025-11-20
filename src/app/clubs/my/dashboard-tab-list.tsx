'use client';

import { ClubDashboardTab, tabMap } from '@/app/clubs/my/tabMap';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navigation/club-dashboard-navbar-items';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useContext } from 'react';

const ClubDashboardTabList: FC<{
  selectedClub: string;
  setTab: (_arg: ClubDashboardTab) => void;
  activeTab: ClubDashboardTab;
}> = ({ selectedClub, setTab, activeTab }) => {
  const t = useTranslations('Club.Dashboard');
  const { isMobile } = useContext(MediaQueryContext);
  const preparedTabs = Object.keys(tabMap) as ClubDashboardTab[];
  // const preparedTabs = (Object.keys(tabMap) as ClubDashboardTab[]).filter(
  //   (tab) => isMobile || ['main', 'players', 'tournaments'].includes(tab),
  // );
  const notifications = useClubNotifications(selectedClub);
  const hasNewNotifications = Boolean(
    notifications?.data?.some(({ notification }) => !notification.isSeen),
  );

  return (
    <Tabs
      defaultValue="main"
      onValueChange={(value) => setTab(value as ClubDashboardTab)}
      value={activeTab}
      className="z-40 w-full rounded-none transition-all duration-500"
    >
      <TabsList className="no-scrollbar w-full justify-around overflow-scroll rounded-none md:justify-start">
        {preparedTabs.map((tab) => (
          <TabsTrigger key={tab} className="w-full" value={tab}>
            {isMobile ? (
              <Logo
                tab={tab}
                hasNewNotifications={hasNewNotifications}
                activeTab={activeTab}
              />
            ) : (
              <>{t(tab)}</>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

const Logo: FC<{
  tab: ClubDashboardTab;
  activeTab: ClubDashboardTab;
  hasNewNotifications: boolean;
}> = ({ tab, activeTab, hasNewNotifications }) => {
  const item = CLUB_DASHBOARD_NAVBAR_ITEMS[tab];
  const isActive = tab === activeTab;
  if (!item || !item.logo) return tab;

  const Icon: LucideIcon = item.logo;
  const shouldShowBadge = hasNewNotifications && tab === 'inbox';

  return (
    <div className="relative">
      {shouldShowBadge && <Badge />}
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
    </div>
  );
};

const Badge: FC = () => (
  <div className="absolute -top-0.25 -right-0.5 size-2 rounded-full bg-red-500" />
);

export default ClubDashboardTabList;
