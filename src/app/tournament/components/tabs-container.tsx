import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { MkTabs, MkTabsList, MkTabsTrigger } from '@/components/customized-tabs';
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
    <MkTabs
      defaultValue="main"
      onValueChange={(value) => setCurrentTab(value)}
      value={value}
      className="fixed top-14 z-40 w-full rounded-none"
    >
      <MkTabsList
        ref={tabRef}
        className="scrollbar-hide w-full justify-between overflow-scroll rounded-none"
        // here, justify-between is crucial for long lists, for lists without scroll use justify-around
      >
        {tabs.map((tab) => (
          <div key={tab.title}>
            <TabsIteratee title={tab.title} />
          </div>
        ))}
      </MkTabsList>
    </MkTabs>
  );
};

const TabsIteratee = ({ title }: { title: string }) => (
  <MkTabsTrigger className="w-full" value={title}>
    {title}
  </MkTabsTrigger>
);

export default TabsContainer;
