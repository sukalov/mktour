import { tabsArray } from '@/app/tournament/components/helpers/tabs';
import { FC } from 'react';

const TabContent: FC<{ currentTab: string }> = ({ currentTab }) => {
  const Component =
    tabsArray.find((tab) => tab.title === currentTab)?.component ||
    tabsArray[0].component;

  return (
    <div className="mb-4 mt-[3.5rem]">
      <Component />
    </div>
  );
};

export default TabContent;
