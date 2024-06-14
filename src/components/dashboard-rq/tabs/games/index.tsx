import RoundsDesktop from '@/components/dashboard-rq/tabs/games/rounds-desktop';
import RoundsMobile from '@/components/dashboard-rq/tabs/games/rounds-mobile';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { FC, useContext } from 'react';

const Games: FC = () => {
  const { isMobile } = useContext(MediaQueryContext);
  const component = isMobile ? <RoundsMobile /> : <RoundsDesktop />;

  return component;
};

export default Games;
