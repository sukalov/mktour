'use client';

import { SOCKET_URL } from '@/lib/config/urls';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { handleSocketMessage } from '@/lib/handle-socket-message';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { newid } from '@/lib/utils';
import { TournamentModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const TournamentPageContent = ({ session, id, state }: TournamentPageContentProps) => {
  const { isLoading, addNewPlayer, ...tournament } = useTournamentStore();
  console.log(tournament);
  useEffect(() => {
    tournament.init(state);
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

  const handleClick = () => {
    const id = newid()
    const newPlayer: DatabasePlayer = {
      id,
      nickname: 'NEW PLAYER',
      club_id: '',
      realname: null,
      user_id: null,
      rating: null,
    };
    addNewPlayer(newPlayer);
    const message: Message = { body: newPlayer, type: 'add-new-player' }
    sendJsonMessage(message);
  };

  return (<>{
    isLoading ? <p>Loading...</p> :
    <div>
      <pre>{JSON.stringify(tournament, null, 2)}</pre>
      <br />
      <button onClick={handleClick}>ADD NEW PLAYER AND SEND HIM</button>
    </div>
}
    </>
  );
};

interface TournamentPageContentProps {
  session: string;
  id: string;
  state: TournamentModel;
}

export default TournamentPageContent;
