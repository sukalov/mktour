import { PlayerModel, Result } from '@/types/tournaments';

type Message =
  | { type: 'add-existing-player'; body: PlayerModel }
  | { type: 'add-new-player'; body: PlayerModel }
  | { type: 'remove-player'; id: string } // onError add-exidsting-player
  | { type: 'start-tournament' }
  | { type: 'set-game-result'; gameId: string; result: Result }
  | { type: 'set-tournament-status', closed_at: Date }
  | { type: 'set-tournament-status', started_at: Date }
  | ErrorMessage;

type ErrorMessage = {
  type: 'error';
  data: Message;
};
