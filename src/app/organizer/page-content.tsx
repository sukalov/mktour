'use client';

import { SOCKET_URL } from '@/lib/config/urls';
import { handleSocketMessage } from '@/lib/handle-socket-message';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const OrganizerPageContent = ({ session }: { session: string }) => {
  const { isLoading, addPlayer, ...tournament } = useTournamentStore();
  console.log(tournament);
  useEffect(() => {
    tournament.init('OuFEd-CU3jhYKpP-e-SIk');
  }, []);

  const { sendJsonMessage } = useWebSocket(`${SOCKET_URL}/test-usews-hook`, {
    queryParams: {
      auth_session: session,
    },
    onOpen: () => console.log('opened'),
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
    },
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      handleSocketMessage(message);
    },
  });

  const handleClick = () => {
    const id = String(Math.floor(Math.random() * 999999));
    const newPlayer = {
      id,
      nickname: 'NEW PLAYER',
      club_id: '',
      realname: null,
      user_id: null,
      rating: null,
    };
    addPlayer(newPlayer);
    sendJsonMessage({ body: newPlayer, type: 'add-player' });
  };

  return (
    <div>
      <pre>{JSON.stringify(tournament, null, 2)}</pre>
      <br />
      <button onClick={handleClick}>ADD NEW PLAYER AND SEND HIM</button>
    </div>
  );
};

export default OrganizerPageContent;
