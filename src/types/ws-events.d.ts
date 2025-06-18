import { PlayerModel, Result } from '@/types/tournaments';

type DashboardMessage =
  | { type: 'add-existing-player'; body: PlayerModel }
  | { type: 'add-new-player'; body: PlayerModel }
  | { type: 'remove-player'; id: string } // onError add-exidsting-player
  | {
      type: 'set-game-result';
      gameId: string;
      result: Result;
      roundNumber: number;
    }
  | { type: 'start-tournament'; started_at: Date }
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
  message: string;
};

type GlobalErrorMessage = {
  recipientId: string;
  type: 'error';
  message: string;
};

// recipientId = userId
type GlobalMessage =
  | { type: 'user_notification'; recipientId: string }
  | { type: 'removed_from_club'; clubId: string; recipientId: string }
  | GlobalErrorMessage;
