import { createContext } from 'react';

export type MediaQueryContextType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export const MediaQueryContext = createContext<MediaQueryContextType>({
  isMobile: true,
  isTablet: true,
  isDesktop: true,
});
