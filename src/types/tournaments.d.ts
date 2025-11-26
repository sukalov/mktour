import { DatabaseGame } from '@/server/db/schema/tournaments';
/**
 *
 */
export interface GameModel extends DatabaseGame {
  blackNickname: string; // players where id === games.black_id  nickname;
  whiteNickname: string; // players where id === games.white_id  nickname;
}
