import { DashboardContextType } from '@/app/tournament/[id]/dashboard/dashboard-context';
import tabs from '@/app/tournament/[id]/dashboard/tabs';
import { Dispatch, SetStateAction } from 'react';

const handleSwipe = (
  direction: string,
  indexOfTab: number,
  setCurrentTab: Dispatch<SetStateAction<DashboardContextType['currentTab']>>,
) => {
  let newIndex;
  if (direction === '<') {
    newIndex = indexOfTab > 0 ? indexOfTab - 1 : tabs.length - 1;
  } else if (direction === '>') {
    newIndex = indexOfTab < tabs.length - 1 ? indexOfTab + 1 : 0;
  } else return; // Invalid direction

  setCurrentTab(tabs[newIndex].title);
};

export default handleSwipe;
