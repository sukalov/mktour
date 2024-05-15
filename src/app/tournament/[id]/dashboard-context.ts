import { createContext } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export const DashboardContext = createContext<DashboardContextType>({
  currentTab: 'main',
  roundInView: 1,
  sendJsonMessage: () => null
});

export type DashboardContextType = {
  currentTab: 'main' | 'table' | 'games';
  roundInView: number;
  sendJsonMessage: SendJsonMessage
};