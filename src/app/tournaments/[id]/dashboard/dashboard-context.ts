import { Status } from '@/lib/db/queries/get-status-in-tournament';
import { Message } from '@/types/ws-events';
import { createContext, Dispatch, SetStateAction } from 'react';

export const DashboardContext = createContext<DashboardContextType>({
  currentTab: 'main',
  sendJsonMessage: () => null,
  status: 'viewer',
  userId: undefined,
  escapedItemId: null,
  setEscapedItemId: () => null,
  roundInView: 1,
  setRoundInView: () => null,
});

export type DashboardContextType = {
  currentTab: 'main' | 'table' | 'games';
  sendJsonMessage: (_jsonMessage: Message, _keep?: boolean) => void;
  status: Status;
  userId: string | undefined;
  escapedItemId: string | null;
  setEscapedItemId: Dispatch<SetStateAction<string | null>>;
  roundInView: number;
  setRoundInView: Dispatch<SetStateAction<number>>;
};
