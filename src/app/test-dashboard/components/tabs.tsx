import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabsContainer = ({ currentTab, setCurrentTab }: any) => {
  const value = currentTab || 'table';

  return (
    <Tabs
      defaultValue="table"
      onValueChange={(value) => setCurrentTab(value)}
      value={value}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="table">table</TabsTrigger>
        <TabsTrigger value="brackets">brackets</TabsTrigger>
      </TabsList>
      <TabsContent value="table"></TabsContent>
      <TabsContent value="brackets"></TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
