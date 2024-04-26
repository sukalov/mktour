'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SOCKET_URL } from '@/config/urls';
// import { useEffect } from 'react';
// import { useState } from "react";

export default function SocketTests() {
  // const [smth, setSmth] = useState()
  let ws: WebSocket
  connectSocket()

  function connectSocket() {
    ws = new WebSocket(`${SOCKET_URL}/randomTournamentId`);
    ws.onopen = () => pingpong();
    ws.onmessage = (message) => console.log(message.data)
  }

  function pingpong() {
    if (!ws) return;
    if (ws.readyState !== 1) return;
    ws.send("ping");
    setTimeout(pingpong, 2000);
  }

  const sendMessage = (formData: FormData) => {
    ws.send(formData.get('message') ?? '')
  }

  return (
    <div>
        <form action={sendMessage}>
            <Input name='message'/>
            <Button type='submit'>send</Button>
        </form>
    </div>
  );
}
