import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { Message } from '@/types/ws-events';

export const handleSocketMessage = ({ type, body }: Message) => {
  switch (type) {
    case 'add-new-player':
    case 'add-existing-player':
      useTournamentStore.getState().addPlayer(body);
      break;

    default:
      break;
  }
};
