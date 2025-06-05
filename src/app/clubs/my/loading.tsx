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
        {Object.entries(CLUB_DASHBOARD_NAVBAR_ITEMS).map(([title]) => (
          <TabsTrigger key={title} className="w-full" value={title}>
            <Logo tab={title} activeTab={title as ClubDashboardTab} />
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
  const item = Object.entries(CLUB_DASHBOARD_NAVBAR_ITEMS).find(
    (item) => item[0] === tab,
  );
  const isActive = tab === activeTab;
  if (!item || !item[1].logo) return tab;

  const Icon: LucideIcon = item[1].logo;

  return <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />;
};
