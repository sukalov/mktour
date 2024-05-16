import { useTournamentStore } from '@/lib/hooks/use-tournament-store';

export const handleSocketMessage = (message: Message) => {
  switch (message.type) {
    case 'add-new-player':
      useTournamentStore.getState().addNewPlayer(message.body);
      break;
    case 'add-existing-player':
      useTournamentStore.getState().addPlayer(message.id);
      break;
    case 'remove-player':
      useTournamentStore.getState().removePlayer(message.id);
      break;

    default:
      break;
  }
};
