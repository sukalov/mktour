import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { TournamentStore } from '@/lib/hooks/use-tournament-store';
import { newid } from '@/lib/utils';
import { faker } from '@faker-js/faker';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export const onClickAddNewPlayer = (
  tournament: TournamentStore,
  sendJsonMessage: SendJsonMessage,
) => {
  const id = newid();
  const name = faker.person.fullName();
  const newPlayer: DatabasePlayer = {
    id,
    nickname: name,
    club_id: tournament.organizer.id,
    realname: name,
    user_id: null,
    rating: Math.floor(Math.random() * 1200 + 1200),
    last_seen: 0,
  };
  tournament.addNewPlayer(newPlayer);
  const message: Message = { body: newPlayer, type: 'add-new-player' };
  sendJsonMessage(message);
};

export const onClickAddExistingPlayer = (
  player: DatabasePlayer,
  tournament: TournamentStore,
  sendJsonMessage: SendJsonMessage,
) => {
  tournament.addPlayer(player.id);
  const message: Message = { id: player.id, type: 'add-existing-player' };
  sendJsonMessage(message);
};

export const onClickRemovePlayer = (
  id: string,
  tournament: TournamentStore,
  sendJsonMessage: SendJsonMessage,
) => {
  tournament.removePlayer(id);
  const message: Message = { type: 'remove-player', id };
  sendJsonMessage(message);
};
