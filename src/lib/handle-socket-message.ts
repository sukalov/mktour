import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { Message } from '@/types/ws-events';

export const handleSocketMessage = ({ type, body }: Message) => {
  switch (type) {
    case 'add-new-player':
      useTournamentStore.getState().addNewPlayer(body);
      break;

    default:
      break;
  }
};
