'use client';

import { ClubDashboardTab, tabMap } from '@/app/clubs/my/tabMap';
import { useClubNotifications } from '@/components/hooks/query-hooks/use-club-notifications';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navigation/club-dashboard-navbar-items';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import Badge from '@/components/ui-custom/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useContext } from 'react';

const ClubDashboardTabList: FC<{
  selectedClub: string;
  setTab: (_arg: ClubDashboardTab) => void;
  activeTab: ClubDashboardTab;
}> = ({ selectedClub, setTab, activeTab }) => {
  const { isMobile } = useContext(MediaQueryContext);
  const preparedTabs = Object.keys(tabMap) as ClubDashboardTab[];
  const notifications = useClubNotifications(selectedClub);
  const hasNewNotifications = Boolean(
    notifications?.data?.some(({ isSeen }) => !isSeen),
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
            <TabContent
              tab={tab}
              hasNewNotifications={hasNewNotifications}
              activeTab={activeTab}
              isMobile={isMobile}
            />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

const TabContent: FC<{
  tab: ClubDashboardTab;
  activeTab: ClubDashboardTab;
  hasNewNotifications: boolean;
  isMobile: boolean;
}> = ({ tab, activeTab, hasNewNotifications, isMobile }) => {
  const item = CLUB_DASHBOARD_NAVBAR_ITEMS[tab];
  const isActive = tab === activeTab;
  const t = useTranslations('Club.Dashboard');

  if (!item || !item.logo) return tab;

  const Icon: LucideIcon = item.logo;
  const shouldShowBadge = hasNewNotifications && tab === 'inbox';

  return (
    <div className="relative w-fit">
      {isMobile ? <Icon size={18} strokeWidth={isActive ? 2.5 : 2} /> : t(tab)}
      {shouldShowBadge && <Badge isMobile={isMobile} />}
    </div>
  );
};

export default ClubDashboardTabList;
