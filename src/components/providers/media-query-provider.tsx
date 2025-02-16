'use client';

import { MediaQueryContext } from '@/components/providers/media-query-context';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const MediaQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 768 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return children;

  console.log(isMobile, isTablet, isDesktop);

  return (
    <MediaQueryContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export default MediaQueryProvider;
