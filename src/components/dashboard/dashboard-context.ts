import { createContext } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export const DashboardContext = createContext<DashboardContextType>({
  currentTab: 'main',
  sendJsonMessage: () => null,
  ongoingRound: 0
});

export type DashboardContextType = {
  currentTab: 'main' | 'table' | 'games';
  sendJsonMessage: SendJsonMessage;
  ongoingRound: number
};
