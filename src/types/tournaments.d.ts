import { DatabaseGame } from '@/server/db/schema/tournaments';

/**
 * combination of player general info and tournament performance, recorded in players_to_tournaments
 */
export interface PlayerModel {
  pairingNumber: number | null;
  id: string;
  nickname: string; // players.nickname
  realname: string | null;
  rating: number;
  wins: number;
  draws: number;
  losses: number;
  colorIndex: number;
  isOut: boolean | null;
  place: number | null;
}

/**
 *
 */
export interface GameModel extends DatabaseGame {
  blackNickname: string; // players where id === games.black_id  nickname;
  whiteNickname: string; // players where id === games.white_id  nickname;
}
