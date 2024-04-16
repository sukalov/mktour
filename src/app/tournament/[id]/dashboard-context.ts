import {
  DatabaseGame,
  DatabasePlayer,
  DatabasePlayerToTournament,
  DatabaseTournament,
} from '@/lib/db/schema/tournaments';
import { createContext } from 'react';

export const DashboardContext = createContext<DashboardContextType>({
  tournament: {} as DatabaseTournament,
  players: [] as DashboardContextType['players'],
  games: [] as DashboardContextType['games'],
  currentRound: 0,
  currentTab: 'main',
  top: '',
});

export type Round = DashboardContextType['games'][0];

export type DashboardContextType = {
  tournament: DatabaseTournament;
  players: (DatabasePlayerToTournament & Pick<DatabasePlayer, 'nickname'>)[];
  games: (DatabaseGame & {
    white_nickname: string;
    black_nickname: string;
  })[][];
  currentRound: DatabaseGame['round_number'];
  currentTab: 'main' | 'table' | 'games';
  top: string;
};
