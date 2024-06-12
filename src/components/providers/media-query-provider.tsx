'use client';

import { MediaQueryContext } from '@/components/providers/media-query-context';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const MediaQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 500 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return children;

  return (
    <MediaQueryContext.Provider value={{ isMobile, loading: false }}>
      {children}
    </MediaQueryContext.Provider>
  );
};

export default MediaQueryProvider;
