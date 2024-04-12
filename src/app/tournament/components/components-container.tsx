/* eslint-disable no-unused-vars */ // FIXME

import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { FC, useContext } from 'react';

const ComponentsContainer: FC = () => {
  const { tabs, currentTab } = useContext(TournamentContext);
  const tab = tabs.find((tab) => tab.title === currentTab) || tabs[0];

  return <ComponentIteratee>{tab.component}</ComponentIteratee>;
};

const ComponentIteratee: FC<{ children: FC }> = ({ children: Component }) => {
  return (
    <div className="mb-4 mt-[4.5rem]">
      <Component />
    </div>
  );
};

export default ComponentsContainer;
