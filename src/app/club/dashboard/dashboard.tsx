'use client';

import ClubPlayersList from '@/app/club/dashboard/(tabs)/club-players-list';
import ClubSettingsForm from '@/app/club/dashboard/(tabs)/club-settings-form';
import ClubInbox from '@/app/club/dashboard/(tabs)/inbox';
import ClubMain from '@/app/club/dashboard/(tabs)/main';
import ClubDashboardTournaments from '@/app/club/dashboard/(tabs)/tournaments-list';
import ClubSelect from '@/app/club/dashboard/club-select';
import Loading from '@/app/loading';
import Empty from '@/components/empty';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navigation/club-dashboard-navbar-items';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, ReactNode, useContext, useState } from 'react';

export default function Dashboard({ userId }: { userId: string }) {
  const { data, isLoading } = useUser(userId);
  const [tab, setTab] = useState<ClubDashboardTab>('main');
  const ActiveTab: FC<ClubTabProps> = tabMap[tab];
  const t = useTranslations('Empty');

  if (!data && isLoading) return <Loading />;
  if (!data) return <Empty>{t('dashboard')}</Empty>;

  return (
    <div>
      <TabList activeTab={tab} setTab={setTab} />
      <div className="pt-12">
        <div className="px-1">
          <ClubSelect user={data} />
        </div>
        <div className="p-2 pt-2">
          <ActiveTab selectedClub={data.selected_club} />
          {/* <CarouselContainer
            tabs={tabMap}
            currentTab={tab}
            setCurrentTab={setTab}
            setScrolling={() => null}
            selectedClub={data.selected_club}
          /> */}
        </div>
      </div>
    </div>
  );
}

const TabList: FC<{
  setTab: (_arg: ClubDashboardTab) => void;
  activeTab: ClubDashboardTab;
}> = ({ setTab, activeTab }) => {
  const { isMobile } = useContext(MediaQueryContext);

  return (
    <Tabs
      defaultValue="main"
      onValueChange={(value) => setTab(value as ClubDashboardTab)}
      value={activeTab}
      className="fixed z-40 w-full rounded-none transition-all duration-500"
    >
      <TabsList className="w-full justify-around overflow-scroll rounded-none no-scrollbar md:justify-evenly">
        {Object.keys(tabMap).map((tab) => (
          <TabsTrigger key={tab} className="w-full" value={tab}>
            {isMobile ? <Logo tab={tab} activeTab={activeTab} /> : <>{tab}</>}
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

const tabMap: Record<ClubDashboardTab, FC<ClubTabProps>> = {
  main: ClubMain,
  players: ClubPlayersList,
  tournaments: ClubDashboardTournaments,
  inbox: ClubInbox,
  settings: ClubSettingsForm,
};

type ClubDashboardTab =
  | 'main'
  | 'players'
  | 'tournaments'
  | 'inbox'
  | 'settings';

export type ClubTabProps = {
  selectedClub: string;
  isInView?: boolean;
};
