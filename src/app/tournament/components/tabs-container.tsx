import { tabs } from '@/app/tournament/components/mocks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useRef } from 'react';

const TabsContainer = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: string;
  setCurrentTab: (value: string) => void;
}) => {
  const value = currentTab || 'main';
  const tabRef = useRef<HTMLDivElement>(null);
  const indexOfTab = tabs.indexOf(value);

  useEffect(() => {
    const scrollX = indexOfTab <= tabs.length / 2 ? -1000 : 1000;
    tabRef.current?.scrollBy(scrollX, 0);
  }, [indexOfTab, value]);

  const TabsIteratee = () => (
    <>
      {tabs.map((tab) => (
        <TabsTrigger key={tab} className="w-full" value={tab}>
          {tab}
        </TabsTrigger>
      ))}
    </>
  );

  return (
    <Tabs
      defaultValue="main"
      onValueChange={(value) => setCurrentTab(value)}
      value={value}
      className="w-full"
    >
      <TabsList
        ref={tabRef}
        className="scrollbar-hide flex w-full flex-row justify-between overflow-scroll"
      >
        <TabsIteratee />
      </TabsList>
    </Tabs>
  );
};

export default TabsContainer;
