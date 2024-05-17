import { TabProps } from '@/app/tournament/[id]/dashboard';
import { DashboardContextType } from '@/components/dashboard/dashboard-context';
import handleSwipe from '@/components/dashboard/helpers/handle-swipe';
import tabs from '@/components/dashboard/tabs';
import SwipeDetector from '@/components/swipe-detector';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, useEffect, useRef } from 'react';

const TabsContainer: FC<TabProps> = ({ currentTab, setCurrentTab, top }) => {
  const value: DashboardContextType['currentTab'] = currentTab;
  const tabRef = useRef<HTMLDivElement>(null);
  const indexOfTab = tabs?.findIndex((tab) => tab?.title === value);

  useEffect(() => {
    tabRef.current?.children[indexOfTab]?.scrollIntoView({
      inline: 'center',
      block: 'start',
      behavior: 'smooth',
    });
  }, [indexOfTab]);

  const onSwipe = (direction: string) =>
    handleSwipe(direction, indexOfTab, setCurrentTab);

  return (
    <SwipeDetector
      onSwipeLeft={() => onSwipe('<')}
      onSwipeRight={() => onSwipe('>')}
    >
      <Tabs
        defaultValue="main"
        onValueChange={(value) =>
          setCurrentTab(value as DashboardContextType['currentTab'])
        }
        value={value}
        className={`${top} fixed z-40 w-full rounded-none transition-all duration-500`}
      >
        <TabsList
          ref={tabRef}
          className={`scrollbar-hide w-full justify-around overflow-scroll rounded-none md:justify-evenly`}
        >
          {tabs.map((tab) => (
            <div key={tab.title}>
              <TabsTrigger className="w-full" value={tab.title}>
                {tab.title}
              </TabsTrigger>
            </div>
          ))}
        </TabsList>
      </Tabs>
    </SwipeDetector>
  );
};

export default TabsContainer;
