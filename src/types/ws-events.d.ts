import { PlayerModel } from '@/types/tournaments';

type Message =
  | { type: 'add-existing-player'; body: PlayerModel }
  | { type: 'add-new-player'; body: PlayerModel }
  | { type: 'remove-player'; id: string } // onError add-exidsting-player
  | { type: 'start-tournament' }
  | ErrorMessage;

type ErrorMessage = {
  type: 'error';
  data: Message;
};
