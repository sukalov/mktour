'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SOCKET_URL } from '@/config/urls';
import { useRef, useState } from 'react';
import useSWRSubscription from 'swr/subscription';

export const dynamic = 'force-dynamic';

export default function SocketTests() {
  const [messages, setMessages] = useState<string[]>([])
  const ws = useRef<WebSocket>();

  const { data, error } = useSWRSubscription(
    `${SOCKET_URL}/randomTournamentId`,
    (key, { next }) => {
      ws.current = new WebSocket(key);
      ws.current.onopen = () => {
        pingpong();
        console.log('WebSocket Connection');
      };
      ws.current.onmessage = (event) => {
        console.log({ data, error });
        next(null, event.data);
        console.log(event.data);
        setMessages(prev => prev.concat(event.data))
      };
      ws.current.onerror = (error) => next(error, null);
      return () => ws.current?.close();
    },
  );

  function pingpong() {
    if (!ws.current) return;
    if (ws.current.readyState !== 1) return;
    ws.current.send('ping');
    setTimeout(pingpong, 2000);
  }

  const sendMessage = (formData: FormData) => {
    if (!ws.current) {console.log('NOTSENT: ' + formData.get('message')); return }
    ws.current.send(formData.get('message') ?? '');
    setMessages(prev => [...prev, `me: ${formData.get('message') ?? ''}`]);
  };

  return (
    <div>
      <form action={sendMessage} className='p-4'>
        <Input name="message" className='max-w-md w-full' placeholder='test message'/>
        <Button type="submit" className=' mt-4 w-full'>send</Button>
      </form>
      {messages.map((msg: string, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  );
}
