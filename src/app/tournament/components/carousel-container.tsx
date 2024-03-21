/* eslint-disable no-unused-vars */ // FIXME

import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { FC, useContext } from 'react';

const CarouselContainer: FC = () => {
  const { tabs, currentTab } = useContext(TournamentContext);
  const tab = tabs.find((tab) => tab.title === currentTab);
  return <CarouselIteratee>{tab!.component}</CarouselIteratee>;
};

const CarouselIteratee: FC<{ children: FC }> = ({ children: Component }) => {
  return (
    <div className="mt-[4.5rem]">
      <Component />
    </div>
  );
};

export default CarouselContainer;
