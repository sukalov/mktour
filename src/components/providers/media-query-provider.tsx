'use client';

import {
  MediaQueryContext,
  MediaQueryContextType,
} from '@/components/providers/media-query-context';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const DEFAULT_CONTEXT: MediaQueryContextType = {
  isMobile: true,
  isTablet: true,
  isDesktop: false,
};

const MediaQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ maxWidth: 767 }); // NB: this probably should be 1023px
  const isDesktop = useMediaQuery({ minWidth: 768 }); // whilst this should be 1024px

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  const value = useMemo(
    () => (isMounted ? { isMobile, isTablet, isDesktop } : DEFAULT_CONTEXT),
    [isMounted, isMobile, isTablet, isDesktop],
  );

  return (
    <MediaQueryContext.Provider value={value}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export default MediaQueryProvider;
