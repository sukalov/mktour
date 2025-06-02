import { ClubDashboardTab } from '@/app/clubs/my/tabMap';
import { CLUB_DASHBOARD_NAVBAR_ITEMS } from '@/components/navigation/club-dashboard-navbar-items';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { FC, ReactNode } from 'react';

export default function Page() {
  return (
    <>
      <ClubDashboardTabList />
      <div className="mk-container">
        <Skeleton className="h-[80svh] w-full" />
      </div>
    </>
  );
}

const ClubDashboardTabList: FC = () => {
  return (
    <Tabs
      defaultValue="main"
      value="main"
      className="z-40 w-full rounded-none transition-all duration-500"
    >
      <TabsList className="no-scrollbar w-full justify-around overflow-scroll rounded-none md:justify-start">
        {CLUB_DASHBOARD_NAVBAR_ITEMS.map((tab) => (
          <TabsTrigger key={tab.title} className="w-full" value={tab.title}>
            <Logo
              tab={tab.title}
              activeTab={CLUB_DASHBOARD_NAVBAR_ITEMS[0].title}
            />
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
