import { Status } from '@/lib/db/hooks/get-status-in-tournament';
import { Message } from '@/types/ws-events';
import { createContext, Dispatch, SetStateAction } from 'react';

export const DashboardContext = createContext<DashboardContextType>({
  currentTab: 'main',
  sendJsonMessage: () => null,
  status: 'viewer',
  userId: undefined,
  overlayed: false,
  escapedItemId: null,
  setEscapedItemId: () => null,
  setOverlayed: () => null,
  roundInView: 1,
  setRoundInView: () => null,
});

export type DashboardContextType = {
  currentTab: 'main' | 'table' | 'games';
  sendJsonMessage: (_jsonMessage: Message, _keep?: boolean) => void;
  status: Status;
  userId: string | undefined;
  overlayed: boolean;
  setOverlayed: Dispatch<SetStateAction<boolean>>;
  escapedItemId: string | null;
  setEscapedItemId: Dispatch<SetStateAction<string>>;
  roundInView: number;
  setRoundInView: Dispatch<SetStateAction<number>>;
};
