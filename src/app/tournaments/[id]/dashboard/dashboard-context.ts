import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { createContext, Dispatch, SetStateAction } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export const DashboardContext = createContext<DashboardContextType>({
  currentTab: 'main',
  sendJsonMessage: () => null,
  status: 'viewer',
  userId: undefined,
  overlayed: false,
  setOverlayed: () => null,
  tournamentId: undefined,
});

export type DashboardContextType = {
  currentTab: 'main' | 'table' | 'games';
  sendJsonMessage: SendJsonMessage;
  status: Status;
  userId: string | undefined;
  overlayed: boolean;
  setOverlayed: Dispatch<SetStateAction<boolean>>;
  tournamentId: string | undefined;
};
