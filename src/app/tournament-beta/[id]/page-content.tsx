'use client';

import TestOtherClientComponent from '@/app/tournament-beta/[id]/test-other-client-component';
import { Button } from '@/components/ui/button';
import { SOCKET_URL } from '@/lib/config/urls';
import { Status } from '@/lib/db/hooks/use-status-in-tournament';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { handleSocketMessage } from '@/lib/handle-socket-message';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { newid } from '@/lib/utils';
import { TournamentModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { faker } from '@faker-js/faker';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const TournamentPageContent = ({
  session,
  id,
  state,
  status,
}: TournamentPageContentProps) => {
  const { isLoading, addPlayer, possiblePlayers, ...tournament } =
    useTournamentStore();

  useEffect(() => {
    tournament.init(state);
  }, []);

  useEffect(() => {
    (async () => {
      const possiblePlayersReq = await fetch(
        '/api/tournament-possible-players',
        {
          method: 'POST',
          body: JSON.stringify({
            id,
            tournament: state,
          }),
        },
      );
      console.log(possiblePlayersReq);
      const possiblePlayers =
        (await possiblePlayersReq.json()) as Array<DatabasePlayer>;
      console.log(possiblePlayers);
      tournament.initPossiblePlayers(possiblePlayers);
    })();
  }, []);

  const { sendJsonMessage } = useWebSocket(`${SOCKET_URL}/${id}`, {
    queryParams: {
      auth_session: session,
    },
    onOpen: () => console.log('opened'),
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
      message: '',
    },
    onMessage: (event) => {
      if (!event.data) return;
      const message = JSON.parse(event.data);
      handleSocketMessage(message);
    },
  });

  const onClickAddNewPlayer = () => {
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

  const onClickAddExistingPlayer = (player: DatabasePlayer) => {
    tournament.removePossiblePlayer(player)
    addPlayer(player);
    const message: Message = { body: player, type: 'add-existing-player' };
    sendJsonMessage(message);
  }

  return (
    <>
      {isLoading ? (
        <div>
        <TestOtherClientComponent />
        Loading...
        </div>
      ) : (
        <div>
          <TestOtherClientComponent />
          <pre>{JSON.stringify(tournament, null, 2)}</pre>
          <br />
          {status === 'organizer' && (
            <Button onClick={onClickAddNewPlayer}>
              ADD COMPLETELY NEW PLAYER AND SEND HIM
            </Button>
          )}
          <div className="p-12"></div>
          {possiblePlayers[0] !== undefined &&
            possiblePlayers.map((player) => {
              return <Button className="p-2 m-2" onClick={() => onClickAddExistingPlayer(player)}>Add {player.nickname}</Button>;
            })}

        </div>
      )}
    </>
  );
};

interface TournamentPageContentProps {
  session: string;
  id: string;
  state: TournamentModel;
  status: Status;
}

export default TournamentPageContent;
