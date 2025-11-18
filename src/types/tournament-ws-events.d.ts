import { PlayerModel, Result } from '@/types/tournaments';

type DashboardMessage =
  | { event: 'add-existing-player'; body: PlayerModel }
  | { event: 'add-new-player'; body: PlayerModel }
  | { event: 'remove-player'; id: string } // onError add-exidsting-player
  | {
      event: 'set-game-result';
      gameId: string;
      result: Result;
      roundNumber: number;
    }
  | { event: 'start-tournament'; started_at: Date }
  | { event: 'reset-tournament' }
  | {
      event: 'new-round';
      roundNumber: number;
      newGames: GameModel[];
      isTournamentGoing: boolean;
    }
  | { event: 'finish-tournament'; closed_at: Date }
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
