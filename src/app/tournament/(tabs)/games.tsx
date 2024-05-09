import RoundsDesktop from '@/app/tournament/components/rounds-desktop';
import RoundsMobile from '@/app/tournament/components/rounds-mobile';
import { FC } from 'react';
import { useMediaQuery } from 'react-responsive';

const Games: FC = () => {
  // const { games, currentRound, currentTab } = useContext(DashboardContext);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  if (isMobile) return <RoundsMobile />;
  return <RoundsDesktop />;
};

export default Games;
