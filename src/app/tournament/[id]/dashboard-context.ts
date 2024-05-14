import { TournamentModel } from '@/types/tournaments';
import { createContext } from 'react';

export const DashboardContext = createContext<DashboardContextType>({
  currentTab: 'main',
  roundInView: 0
});

export type DashboardContextType = {
  tournament?: TournamentModel;
  currentTab: 'main' | 'table' | 'games';
  roundInView: number
};
