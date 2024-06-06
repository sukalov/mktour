import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { newid } from '@/lib/utils';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export const onClickAddNewPlayer = (
  name: DatabasePlayer['nickname'],
  rating: DatabasePlayer['rating'],
  sendJsonMessage: SendJsonMessage,
) => {
  const id = newid();
  const newPlayer: DatabasePlayer = {
    id,
    nickname: name,
    club_id: useTournamentStore.getState().organizer.id,
    realname: name,
    user_id: null,
    rating,
    last_seen: 0,
  };
  useTournamentStore.getState().addNewPlayer(newPlayer);
  const message: Message = { body: newPlayer, type: 'add-new-player' };
  sendJsonMessage(message);
};

export const onClickAddExistingPlayer = (
  id: string,
  sendJsonMessage: SendJsonMessage,
) => {
  useTournamentStore.getState().addPlayer(id);
  const message: Message = { id, type: 'add-existing-player' };
  sendJsonMessage(message);
};

export const onClickRemovePlayer = (
  id: string,
  sendJsonMessage: SendJsonMessage,
) => {
  useTournamentStore.getState().removePlayer(id);
  const message: Message = { type: 'remove-player', id };
  sendJsonMessage(message);
};
