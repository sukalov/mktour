'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SOCKET_URL } from '@/lib/config/urls';
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';

export const dynamic = 'force-dynamic';

interface SocketTestsProps {
  session: string;
}

export default function SocketTests({ session }: SocketTestsProps) {
  const {
    sendMessage,
    // sendJsonMessage,
    // lastMessage,
    // lastJsonMessage,
    // readyState,
    // getWebSocket,
  } = useWebSocket(`${SOCKET_URL}/test-usews-hook`, {
    queryParams: {
      auth_session: session,
    },
    onOpen: () => console.log('opened'),
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
    },
    onMessage: (event) => {
      setMessages((prev) => prev.concat(event.data));
    },
  });

  const [messages, setMessages] = useState<string[]>([]);
  // const ws = useRef<WebSocket>();
  // const inputRef = useRef<HTMLInputElement | null>(null);

  //   const { data, error } = useSWRSubscription(
  // useSWRSubscription(
  //   `${SOCKET_URL}/randomTournamentId?auth_session=${session}`,
  //   (key, { next }) => {
  //     ws.current = new WebSocket(key);
  //     ws.current.onopen = () => {
  //       pingpong();
  //     };
  //     ws.current.onmessage = (event) => {
  //       next(null, event.data);
  //       setMessages((prev) => prev.concat(event.data));
  //     };
  //     ws.current.onerror = (error) => next(error, null);
  //     return () => ws.current?.close();
  //   },
  // );

  // function pingpong() {
  //   if (!ws.current) return;
  //   if (ws.current.readyState !== 1) return;
  //   ws.current.send('ping');
  //   setTimeout(pingpong, 2000);
  // }

  const sendWSMessage = (formData: FormData) => {
    // inputRef!.current!.value = '';
    sendMessage(formData.get('message') ?? '');
    setMessages((prev) => [...prev, `me: ${formData.get('message')}`]);
  };

  return (
    <div>
      <form action={sendWSMessage} className="p-4">
        <Input
          name="message"
          className="w-full max-w-md"
          placeholder="test message"
          // ref={inputRef}
          minLength={1}
          required
        />
        <Button type="submit" className=" mt-4 w-full max-w-md">
          send
        </Button>
      </form>
      {messages.map((msg: string, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  );
}
