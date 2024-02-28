
import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, useContext, useEffect, useRef } from 'react';

const TabsContainer: FC = () => {
  const { tabs, currentTab, setCurrentTab } = useContext(TournamentContext);
  const value = currentTab || tabs[0];
  const tabRef = useRef<HTMLDivElement>(null);
  const indexOfTab = tabs.indexOf(value);

  useEffect(() => {
    tabRef.current?.children[indexOfTab].scrollIntoView({ inline: 'center' });
  }, [indexOfTab, value]);

  const TabsIteratee = () => (
    <>
      {tabs.map((tab: string) => (
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
