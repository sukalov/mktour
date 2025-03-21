import { TabProps } from '@/app/tournaments/[id]/dashboard';
import {
  DashboardContext,
  DashboardContextType,
} from '@/app/tournaments/[id]/dashboard/dashboard-context';
import tabs from '@/app/tournaments/[id]/dashboard/tabs';
import Overlay from '@/components/overlay';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs-grid';
import { useTranslations } from 'next-intl';
import { FC, useContext, useRef } from 'react';

const TabsContainer: FC<TabProps> = ({ currentTab, setCurrentTab }) => {
  const value: DashboardContextType['currentTab'] = currentTab;
  const tabRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Tournament.Tabs');
  const { selectedGameId } = useContext(DashboardContext);

  return (
    <Tabs
      defaultValue="main"
      onValueChange={(value) =>
        setCurrentTab(value as DashboardContextType['currentTab'])
      }
      value={value}
      className={`relative h-10 w-full rounded-none`}
    >
      <Overlay open={!!selectedGameId} />
      <TabsList
        ref={tabRef}
        className={`no-scrollbar h-full w-full justify-around overflow-scroll rounded-none md:justify-evenly`}
      >
        {tabs.map((tab) => (
          <div key={tab.title}>
            <TabsTrigger className="w-full" value={tab.title}>
              {t(tab.title)}
            </TabsTrigger>
          </div>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabsContainer;
