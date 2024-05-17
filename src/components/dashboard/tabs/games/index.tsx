import RoundsDesktop from '@/components/dashboard/tabs/games/rounds-desktop';
import RoundsMobile from '@/components/dashboard/tabs/games/rounds-mobile';
import { FC, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const Games: FC = () => {
  // const { games, currentRound, currentTab } = useContext(DashboardContext);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const component = isMobile ? <RoundsMobile /> : <RoundsDesktop />;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return component;
};

export default Games;
