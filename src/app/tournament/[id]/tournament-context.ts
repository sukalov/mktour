import { TournamentProps } from '@/app/tournament/[id]/dashboard';
import { FC, createContext } from 'react';

export const TournamentContext = createContext<TournamentContextType>({
  tournament: {} as TournamentProps,
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
  tournament: TournamentProps;
  tabs: TabType[];
  currentTab: string;
  setCurrentTab: any;
  players: {
    name: string;
    win: number;
    loose: number;
    draw: number;
  }[];
  games: GamesArray;
  currentRound: number;
};
