import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { TournamentStore, addPlayer } from '@/lib/hooks/use-tournament-store';
import { newid } from '@/lib/utils';
import { Message } from '@/types/ws-events';
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
  addPlayer(newPlayer);
  const message: Message = { body: newPlayer, type: 'add-new-player' };
  sendJsonMessage(message);
};

export const onClickAddExistingPlayer = (
  player: DatabasePlayer,
  tournament: TournamentStore,
  sendJsonMessage: SendJsonMessage,
) => {
  tournament.removePossiblePlayer(player);
  addPlayer(player);
  const message: Message = { body: player, type: 'add-existing-player' };
  sendJsonMessage(message);
};
