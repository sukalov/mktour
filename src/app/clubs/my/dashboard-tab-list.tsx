'use client';

import { ClubDashboardTab, tabMap } from '@/app/clubs/my/dashboard';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navigation/club-dashboard-navbar-items';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, ReactNode, useContext } from 'react';

const ClubDashboardTabList: FC<{
  setTab: (_arg: ClubDashboardTab) => void;
  activeTab: ClubDashboardTab;
}> = ({ setTab, activeTab }) => {
  const t = useTranslations('Club.Dashboard');
  const { isMobile } = useContext(MediaQueryContext);
  const preparedTabs = isMobile
    ? (Object.keys(tabMap) as ClubDashboardTab[])
    : (Object.keys(tabMap).filter((tab) =>
        ['main', 'players', 'tournaments'].includes(tab),
      ) as ClubDashboardTab[]);

  return (
    <Tabs
      defaultValue="main"
      onValueChange={(value) => setTab(value as ClubDashboardTab)}
      value={activeTab}
      className="fixed z-40 w-full rounded-none transition-all duration-500"
    >
      <TabsList className="no-scrollbar w-full justify-around overflow-scroll rounded-none md:justify-start">
        {preparedTabs.map((tab) => (
          <TabsTrigger key={tab} className="w-full" value={tab}>
            {isMobile ? (
              <Logo tab={tab} activeTab={activeTab} />
            ) : (
              <>{t(tab)}</>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

const Logo: FC<{ tab: ReactNode; activeTab: ClubDashboardTab }> = ({
  tab,
  activeTab,
}) => {
  const item = CLUB_DASHBOARD_NAVBAR_ITEMS.find((item) => item.title === tab);
  const isActive = tab === activeTab;
  if (!item || !item.logo) return tab;

  const Icon: LucideIcon = item.logo;

  return <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />;
};

export default ClubDashboardTabList;
