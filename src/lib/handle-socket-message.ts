import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';

type Message =
  | {
      type: 'add-player';
      body: DatabasePlayer;
    }
  | { type: ''; body: '' };

export const handleSocketMessage = ({ type, body }: Message) => {
  switch (type) {
    case 'add-player':
      useTournamentStore.getState().addPlayer(body);
      break;

    default:
      break;
  }
};
