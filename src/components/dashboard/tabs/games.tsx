import RoundsDesktop from '@/components/dashboard/rounds-desktop';
import RoundsMobile from '@/components/dashboard/rounds-mobile';
import { FC } from 'react';
import { useMediaQuery } from 'react-responsive';

const Games: FC = () => {
  // const { games, currentRound, currentTab } = useContext(DashboardContext);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const component = isMobile ? <RoundsMobile /> : <RoundsDesktop />;

  return component;
};

export default Games;
