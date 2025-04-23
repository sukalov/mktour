import { PlayerModel, Result } from '@/types/tournaments';

type Message =
  | { type: 'add-existing-player'; body: PlayerModel }
  | { type: 'add-new-player'; body: PlayerModel }
  | { type: 'remove-player'; id: string } // onError add-exidsting-player
  | {
      type: 'set-game-result';
      gameId: string;
      result: Result;
      roundNumber: number;
    }
  | { type: 'start-tournament'; started_at: Date; rounds_number: number }
  | { type: 'reset-tournament' }
  | {
      type: 'new-round';
      roundNumber: number;
      newGames: GameModel[];
      isTournamentGoing: boolean;
    }
  | { type: 'finish-tournament'; closed_at: Date }
  | { type: 'delete-tournament' }
  | ErrorMessage;

type ErrorMessage = {
  type: 'error';
  data: Message;
};
