import { TabProps } from '@/app/tournament/[id]/dashboard';
import { DashboardContextType } from '@/app/tournament/[id]/dashboard-context';
import SwipeDetector from '@/components/swipe-detector';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FC, useEffect, useRef } from 'react';

const TabsContainer: FC<TabProps> = ({
  tabs,
  currentTab,
  setCurrentTab,
  top,
}) => {
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

  const handleSwipe = (direction: string) => {
    let newIndex;
    if (direction === '>') {
      newIndex = indexOfTab > 0 ? indexOfTab - 1 : tabs.length - 1;
    } else if (direction === '<') {
      newIndex = indexOfTab < tabs.length - 1 ? indexOfTab + 1 : 0;
    } else return; // Invalid direction

    setCurrentTab(
      tabs[newIndex].title as DashboardContextType['currentTab'],
    );
  };

  return (
    <SwipeDetector
      onSwipeLeft={() => handleSwipe('<')}
      onSwipeRight={() => handleSwipe('>')}
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
