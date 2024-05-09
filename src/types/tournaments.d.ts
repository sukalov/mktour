export interface PlayerModel {
  id: string;
  name: string; // players.nickname
  rating?: number;
  wins: number;
  draws: number;
  losses: number;
  colorIndex: number;
}

export interface GameModel {
  id: string; // games.id
  black_id: string // games.black_id;
  white_id: string // games.white_id;
  black_name: string; // players where id === games.black_id  nickname;
  white_name: string; // players where id === games.white_id  nickname;
  round_number: number; // games.round_number
  round_name: RoundName; // games.round_name
  result: Result; //games.result
}

export interface TournamentModel {
  id: string; //tournaments.id
  date: string; // tournaments.date
  title: string; // tournaments.title
  type: TournamentType; // tournaments.type
  format: Format; // tournaments.format
  organizer: string; // clubs.name
  organizerId: string; // clubs.id
  status: TournamentStatus; // created according to started_at and closed_at
  rounds_number: number; // tournamnets.rounds_number
  ongoing_round: number; // tournaments.ongoing_round
  games: Array<GameModel>; // games where tournament.id === id
  players: Array<PlayerModel>; // players_to_tournaments where tournament.id === id
}

type Result = '0-1' | '1-0' | '1/2-1/2' | undefined;

type Format = 'swiss' | 'round robin' | 'double elimination';

type TournamentType = 'solo' | 'doubles' | 'team';

type TournamentStatus = 'not started' | 'ongoing' | 'finished';

type RoundName =
  | 'final'
  | 'match_for_third'
  | 'semifinal'
  | 'quarterfinal'
  | '1/8'
  | '1/16'
  | '1/32'
  | '1/64'
  | '1/128';
