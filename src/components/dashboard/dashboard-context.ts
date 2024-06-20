import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { createContext } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export const DashboardContext = createContext<DashboardContextType>({
  currentTab: 'main',
  sendJsonMessage: () => null,
  status: 'viewer',
});

export type DashboardContextType = {
  currentTab: 'main' | 'table' | 'games';
  sendJsonMessage: SendJsonMessage;
  status: Status;
};
