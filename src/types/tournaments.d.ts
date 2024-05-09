export interface PlayerModel {
  name: string;
  rating?: number;
  wins: number;
  draws: number;
  losses: number;
  colorIndex: number;
}

export interface GameModel {
  id: string, // game.id
  black: PlayerModel;
  white: PlayerModel;
  round_number: number; // game.round_number
  result: Result;
  num: number;
}

export interface TournamentModel {
  id: string, //tournaments.id
  date: string,
  title: string, // tournaments.title
  type: TournamentType, // tournaments.type
  format: Format, // tournaments.format
  organizer: string, // clubs.name
  organizerId: string, // clubs.id
  games: Array<GameModel>, // games where tournament.id === id
  players: Array<PlayerModel>, // players_to_tournaments where tournament.id === id
  status: 

}

export type Result = '0-1' | '1-0' | '1/2-1/2' | undefined;

type Format = 'swiss' | 'round robin' | 'double elimination';

type TournamentType = 'solo' | 'doubles' | 'team';

type TournamentStatus = 'not started' | 'ongoing' | 'finished';
