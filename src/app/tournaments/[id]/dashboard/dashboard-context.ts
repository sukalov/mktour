import { Status } from '@/lib/db/hooks/get-status-in-tournament';
import { Message } from '@/types/ws-events';
import { createContext, Dispatch, SetStateAction } from 'react';

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
  sendJsonMessage: (_jsonMessage: Message, _keep?: boolean) => void;
  status: Status;
  userId: string | undefined;
  overlayed: boolean;
  setOverlayed: Dispatch<SetStateAction<boolean>>;
  tournamentId: string | undefined;
};
