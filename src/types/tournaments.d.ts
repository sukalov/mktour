import { DatabaseClub } from '@/lib/db/schema/clubs';
import { DatabaseGame, DatabaseTournament } from '@/lib/db/schema/tournaments';

/**
 * combination of player general info and tournament performance, recorded in players_to_tournaments
 */
export interface PlayerModel {
  id: string;
  nickname: string; // players.nickname
  realname?: string | null;
  rating: number;
  wins: number;
  draws: number;
  losses: number;
  color_index: number;
  is_out: boolean | null;
  place: number | null;
}

/**
 *
 */
export interface GameModel extends DatabaseGame {
  black_nickname: string | null; // players where id === games.black_id  nickname;
  white_nickname: string | null; // players where id === games.white_id  nickname;
}

// export interface TournamentModel { // FIXME this seems out-dated or misleading
//   id: string; //tournaments.id
//   date: string; // tournaments.date
//   title: string; // tournaments.title
//   type: TournamentType | undefined; // tournaments.type
//   format: Format | undefined; // tournaments.format
//   organizer: {
//     id: string; // club.id
//     name: string; // club.name
//   };
//   status: TournamentStatus | undefined; // created according to started_at and closed_at
//   rounds_number: number | null; // tournamnets.rounds_number
//   ongoing_round: number;
//   games: Array<GameModel>; // games where tournament.id === id
//   players: Array<PlayerModel>; // players_to_tournaments where tournament.id === id
//   possiblePlayers: Array<DatabasePlayerSlice>; // players of organizer club except already added
// }

interface TournamentInfo {
  tournament: DatabaseTournament;
  club: DatabaseClub | null;
}

type Result = '0-1' | '1-0' | '1/2-1/2' | null;

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
