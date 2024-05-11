export interface PlayerModel {
  id: string;
  nickname: string; // players.nickname
  rating?: number | null;
  wins: number;
  draws: number;
  losses: number;
  color_index: number;
}

export interface GameModel {
  id: string; // games.id
  black_id: string // games.black_id;
  white_id: string // games.white_id;
  black_nickname: string; // players where id === games.black_id  nickname;
  white_nickname: string; // players where id === games.white_id  nickname;
  round_number: number; // games.round_number
  round_name: RoundName | null; // games.round_name
  result: Result | null; //games.result
}

export interface TournamentModel {
  id: string; //tournaments.id
  date: string; // tournaments.date
  title: string; // tournaments.title
  type: TournamentType | undefined; // tournaments.type
  format: Format | undefined; // tournaments.format
  organizer: string; // clubs.name
  organizer_id: string; // clubs.id
  status: TournamentStatus | undefined; // created according to started_at and closed_at
  rounds_number: number | null; // tournamnets.rounds_number
  games: Array<GameModel>; // games where tournament.id === id
  players: Array<PlayerModel>; // players_to_tournaments where tournament.id === id
}

type Result = '0-1' | '1-0' | '1/2-1/2';

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
