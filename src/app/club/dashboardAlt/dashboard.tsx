'use client';

import ClubPlayersList from '@/app/club/dashboardAlt/(tabs)/club-players-list';
import ClubSettingsForm from '@/app/club/dashboardAlt/(tabs)/club-settings-form';
import ClubInbox from '@/app/club/dashboardAlt/(tabs)/inbox';
import ClubMain from '@/app/club/dashboardAlt/(tabs)/main';
import ClubDashboardTournaments from '@/app/club/dashboardAlt/(tabs)/tournaments-list';
import CarouselContainer from '@/app/club/dashboardAlt/carousel-container';
import ClubSelect from '@/app/club/dashboardAlt/club-select';
import Loading from '@/app/loading';
import Empty from '@/components/empty';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navigation/club-dashboard-navbar-items';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useContext, useEffect, useState } from 'react';

export default function Dashboard({ userId }: { userId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'main';
  const { data, isLoading } = useUser(userId);
  const [tab, setTab] = useState(initialTab);
  const ActiveTab: FC<{ selectedClub: string, isInView: true }> = tabMap[tab];
  const t = useTranslations('Empty');
  console.log(data)

  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('tab', tab);
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [tab, router]);

  if (!data && isLoading) return <Loading />;
  if (!data) return <Empty>{t('dashboard')}</Empty>; // FIXME Intl

  return (
    <div>
      <TabList activeTab={tab} setTab={setTab} />
      <div className="pt-12">
        <div className="px-1">
          <ClubSelect user={data} />
        </div>
        <div className="p-2 pt-2">
          {/* <ActiveTab selectedClub={data.selected_club} /> */}
          <CarouselContainer
            tabs={tabMap}
            currentTab={tab}
            setCurrentTab={setTab}
            setScrolling={() => null}
            selectedClub={data.selected_club}
          />
        </div>
      </div>
    </div>
  );
}

const TabList: FC<{ setTab: (arg: string) => void; activeTab: string }> = ({
  setTab,
  activeTab,
}) => {
  const { isMobile } = useContext(MediaQueryContext);

  return (
    <Tabs
      defaultValue="main"
      onValueChange={(value) => setTab(value)}
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

const Logo: FC<{ tab: string; activeTab: string }> = ({ tab, activeTab }) => {
  const item = CLUB_DASHBOARD_NAVBAR_ITEMS.find((item) => item.title === tab);
  const isActive = tab === activeTab;
  if (!item || !item.logo) return tab;

  const Icon: LucideIcon = item.logo;

  return <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />;
};

const tabMap: Record<string, FC<{ selectedClub: string, isInView: boolean }>> = {
  main: ClubMain,
  players: ClubPlayersList,
  tournaments: ClubDashboardTournaments,
  inbox: ClubInbox,
  settings: ClubSettingsForm,
};
