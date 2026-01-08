import { GameResult } from '@/server/db/zod/enums';
import { PlayerModel } from '@/types/tournaments';

type DashboardMessage =
  | { event: 'add-existing-player'; body: PlayerModel }
  | { event: 'add-new-player'; body: PlayerModel }
  | { event: 'remove-player'; id: string } // onError add-exidsting-player
  | {
      event: 'set-game-result';
      gameId: string;
      result: GameResult;
      roundNumber: number;
    }
  | { event: 'start-tournament'; startedAt: Date }
  | { event: 'reset-tournament' }
  | {
      event: 'new-round';
      roundNumber: number;
      newGames: GameModel[];
      isTournamentGoing: boolean;
    }
  | { event: 'finish-tournament'; closedAt: Date }
  | { event: 'delete-tournament' }
  | { event: 'swiss-new-rounds-number'; roundsNumber: number }
  | ErrorMessage;

type ErrorMessage = {
  event: 'error';
  message: string;
};

type GlobalErrorMessage = {
  recipientId: string;
  event: 'error';
  message: string;
};
