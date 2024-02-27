import { tabs } from '@/app/tournament/components/mocks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

const TabsContainer = ({
  currentTab,
  setCurrentTab,
}: {
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
}) => {
  const value = currentTab || 'main';
  const tabRef = useRef<HTMLDivElement>(null);
  const indexOfTab = tabs.indexOf(value);

  useEffect(() => {
    tabRef.current?.children[indexOfTab].scrollIntoView({ inline: 'center' });
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
