import { useTournamentStore } from '@/lib/hooks/use-tournament-store';

export const handleSocketError = (message: Message) => {
  switch (message.type) {
    case 'add-new-player':
      useTournamentStore.getState().removeNewPlayer(message.body.id);
      break;
    case 'add-existing-player':
      useTournamentStore.getState().removePlayer(message.id);
      break;
    case 'remove-player':
      useTournamentStore.getState().addPlayer(message.id);
      break;
    default:
      break;
  }
};