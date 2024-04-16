import {
  DatabaseGame,
  DatabasePlayer,
  DatabasePlayerToTournament,
  DatabaseTournament,
} from '@/lib/db/schema/tournaments';
import { createContext } from 'react';

export const TournamentContext = createContext<TournamentContextType>({
  tournament: {} as DatabaseTournament,
  players: [] as TournamentContextType['players'],
  games: [] as TournamentContextType['games'],
  currentRound: 0,
  currentTab: 'main',
  top: ''
});

export type Round = TournamentContextType['games'][0];

export type TournamentContextType = {
  tournament: DatabaseTournament;
  players: (DatabasePlayerToTournament & Pick<DatabasePlayer, 'nickname'>)[];
  games: (DatabaseGame & {
    white_nickname: string;
    black_nickname: string;
  })[][];
  currentRound: DatabaseGame['round_number'];
  currentTab: 'main' | 'table' | 'games';
  top: string
};
