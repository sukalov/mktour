import { tabs } from '@/app/tournament/components/mocks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabsContainer = ({ currentTab, setCurrentTab }: any) => {
  const value = currentTab || 'main';
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
      <TabsList className="flex w-full justify-around">
        <TabsIteratee />
      </TabsList>
    </Tabs>
  );
};

export default TabsContainer;
