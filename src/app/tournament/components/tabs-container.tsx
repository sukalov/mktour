import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FC, useContext, useEffect, useRef } from 'react';

const TabsContainer: FC = () => {
  const { tabs, currentTab, setCurrentTab } = useContext(TournamentContext);
  const value = currentTab;
  const tabRef = useRef<HTMLDivElement>(null);
  const indexOfTab = tabs?.findIndex((tab) => tab?.title === value);

  useEffect(() => {
    tabRef.current?.children[indexOfTab]?.scrollIntoView({
      inline: 'center',
      block: 'end',
    });
  }, [indexOfTab]);

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
        {tabs.map((tab) => (
          <div key={tab.title}>
            <TabsIteratee title={tab.title} />
          </div>
        ))}
      </TabsList>
    </Tabs>
  );
};

const TabsIteratee = ({ title }: { title: string }) => (
  <TabsTrigger className="w-full" value={title}>
    {title}
  </TabsTrigger>
);

export default TabsContainer;
