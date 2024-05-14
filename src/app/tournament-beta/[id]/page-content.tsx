'use client';

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
  const { isLoading, addNewPlayer, ...tournament } = useTournamentStore();

  useEffect(() => {
    tournament.init(state);
  }, []);

  // useEffect(() => {
    
  //   tournament.initPossiblePlayers();
  // }, []);

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

  const handleClick = () => {
    const id = newid();
    const name = faker.person.fullName();
    const newPlayer: DatabasePlayer = {
      id,
      nickname: name,
      club_id: tournament.organizer.id,
      realname: name,
      user_id: null,
      rating: Math.floor(Math.random() * 1200 + 1200),
    };
    addNewPlayer(newPlayer);
    const message: Message = { body: newPlayer, type: 'add-new-player' };
    sendJsonMessage(message);
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <pre>{JSON.stringify(tournament, null, 2)}</pre>
          <br />
          {status === 'organizer' && (
            <Button onClick={handleClick}>
              ADD COMPLETELY NEW PLAYER AND SEND HIM
            </Button>
          )}
          <div className="p-12"></div>
          {tournament.possiblePlayers.map((player) => {
            return <pre>{JSON.stringify(player, null, 2)}</pre>;
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
