'use client';

import { MediaQueryContext } from '@/components/providers/media-query-context';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const MediaQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ maxWidth: 767 }); // NB: this probably should be 1023px
  const isDesktop = useMediaQuery({ minWidth: 768 }); // whilst this should be 1024px

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  if (!isMounted) return children;

  return (
    <MediaQueryContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export default MediaQueryProvider;
