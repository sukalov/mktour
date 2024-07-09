import { createContext } from 'react';

export const MediaQueryContext = createContext<Record<string, boolean>>({
  isMobile: true,
  isTablet: true,
  loading: true
});
