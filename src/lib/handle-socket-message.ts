'use client';

import { handleSocketError } from '@/lib/handle-socket-error';
// import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { toast } from 'sonner';

export const handleSocketMessage = (message: Message) => {
  switch (message.type) {
    case 'add-new-player':
      // useTournamentStore.getState().addNewPlayer(message.body);
      break;
    case 'add-existing-player':
      // useTournamentStore.getState().addPlayer(message.id);
      break;
    case 'remove-player':
      // useTournamentStore.getState().removePlayer(message.id);
      break;
    case 'error':
      toast.error(`server couldn't do this action "${message.data.type}"`);
      handleSocketError(message.data);
    default:
      break;
  }
};
