import { TabProps } from '@/app/tournaments/[id]/dashboard';
import { DashboardContextType } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import tabs from '@/app/tournaments/[id]/dashboard/tabs';
import handleSwipe from '@/components/helpers/handle-swipe';
import SwipeDetector from '@/components/helpers/swipe-detector';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useRef } from 'react';

const TabsContainer: FC<TabProps> = ({ currentTab, setCurrentTab, top }) => {
  const value: DashboardContextType['currentTab'] = currentTab;
  const tabRef = useRef<HTMLDivElement>(null);
  const indexOfTab = tabs?.findIndex((tab) => tab?.title === value);
  const t = useTranslations('Tournament.Tabs')

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
          className={`w-full justify-around overflow-scroll rounded-none no-scrollbar md:justify-evenly`}
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
    </SwipeDetector>
  );
};

export default TabsContainer;
