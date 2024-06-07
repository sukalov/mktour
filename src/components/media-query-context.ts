import { createContext } from 'react';

export const MediaQueryContext = createContext<Record<string, boolean>>({
  isMobile: true,
  loading: true
});
