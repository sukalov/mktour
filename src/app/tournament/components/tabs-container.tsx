import { TabProps } from '@/app/tournament/[id]/dashboard';
import { TournamentContextType } from '@/app/tournament/[id]/tournament-context';
import {
  MkTabs,
  MkTabsList,
  MkTabsTrigger,
} from '@/components/customized-tabs';

import { FC, useEffect, useRef } from 'react';

const TabsContainer: FC<TabProps> = ({ tabs, currentTab, setCurrentTab, top }) => {
  const value: TournamentContextType['currentTab'] = currentTab;
  const tabRef = useRef<HTMLDivElement>(null);
  const indexOfTab = tabs?.findIndex((tab) => tab?.title === value);


  useEffect(() => {
    tabRef.current?.children[indexOfTab]?.scrollIntoView({
      inline: 'center',
      block: 'start',
      behavior: 'smooth',
    });
  }, [indexOfTab]);


  return (
    <MkTabs
      defaultValue="main"
      onValueChange={(value) =>
        setCurrentTab(value as TournamentContextType['currentTab'])
      }
      value={value}
      className={`${top} fixed z-40 w-full rounded-none transition-all duration-500`}
    >
      <MkTabsList
        ref={tabRef}
        className={`scrollbar-hide w-full justify-around overflow-scroll rounded-none md:justify-evenly`}
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
