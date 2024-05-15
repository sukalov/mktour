import { TournamentStore } from '@/lib/hooks/use-tournament-store';
import { createContext } from 'react';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export const DashboardContext = createContext<DashboardContextType>({
  tournament: {} as TournamentStore,
  currentTab: 'main',
  roundInView: 1,
  sendJsonMessage: () => null
});

export type DashboardContextType = {
  tournament: TournamentStore;
  currentTab: 'main' | 'table' | 'games';
  roundInView: number;
  sendJsonMessage: SendJsonMessage
};