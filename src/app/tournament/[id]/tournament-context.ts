import { Format, TournamentType } from '@/types/tournaments';
import { FC, SetStateAction, createContext } from 'react';

export const TournamentContext = createContext<TournamentContextType>({
  tournament: {} as TournamentProps,
  tabs: [],
  currentTab: '',
  setCurrentTab: '',
  players: [],
  games: [[]],
  currentRound: 0,
});

export type TournamentProps = {
  id: string;
  title: string | null;
  date: string | null;
  format: Format | null;
  type: TournamentType | null;
  timestamp: number | null;
  club_id: string;
  is_started: boolean | null;
  is_closed: boolean | null;
};

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
  setCurrentTab: SetStateAction<any>;
  players: {
    name: string;
    win: number;
    loose: number;
    draw: number;
  }[];
  games: GamesArray;
  currentRound: number;
};
