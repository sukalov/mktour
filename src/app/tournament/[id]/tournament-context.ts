import { DatabaseTournament } from '@/lib/db/schema/tournaments';
import { FC, SetStateAction, createContext } from 'react';

export const TournamentContext = createContext<TournamentContextType>({
  tournament: {} as DatabaseTournament,
  tabs: [],
  currentTab: '',
  setCurrentTab: '',
  players: [],
  games: [[]],
  currentRound: 0,
});

export type Player = {
  name: string;
  win: number;
  loose: number;
  draw: number;
};

export type TabType = {
  title: string;
  component: FC;
};

export type GameType = {
  players: [Player, Player];
  result: number;
};

export type Round = GameType[];

export type GamesArray = Round[];

export type TournamentContextType = {
  tournament: DatabaseTournament;
  tabs: TabType[];
  currentTab: string;
  setCurrentTab: SetStateAction<any>;
  players: {
    name: string;
    win: number;
    loose: number;
    draw: number;
  }[];
  // players: DatabasePlayer[] // FIXME according to Schema
  games: GamesArray;
  currentRound: number;
};
