import RoundsDesktop from '@/components/dashboard/tabs/games/rounds-desktop';
import RoundsMobile from '@/components/dashboard/tabs/games/rounds-mobile';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import { FC, useContext } from 'react';

const Games: FC = () => {
  const { isMobile } = useContext(MediaQueryContext);
  const component = isMobile ? <RoundsMobile /> : <RoundsDesktop />;

  return component;
};

export default Games;
