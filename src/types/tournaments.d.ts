export interface GameProps {
  white: PlayerModel;
  black: PlayerModel;
  round: number;
  num: number;
}

export interface PlayerModel {
  name: string;
  rating?: number;
  wins: number;
  draws: number;
  losses: number;
  colorIndex: number;
}

export interface GameModel {
  black: PlayerModel;
  white: PlayerModel;
  round: number;
  result: Result;
  num: number;
}

export type Result = '0-1' | '1-0' | '1/2-1/2' | undefined;

type Format = 'swiss' | 'round robin' | 'double elimination';

type TournamentType = 'solo' | 'doubles' | 'team';
