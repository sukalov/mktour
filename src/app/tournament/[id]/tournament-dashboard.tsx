'use client';

import { useEffect, useState } from 'react';

export function TournamentDashboard({
  tournamentId,
}: TournamentDashboardProps) {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState<WebSocket | undefined>(undefined)
  useEffect(() => {
    setWs(new WebSocket(`wss://mktour-f4u4zj6bdq-lz.a.run.app/${tournamentId}`));
  }, [tournamentId])

  useEffect(() => {
    console.log(ws)
    if (ws) ws.onmessage = (e) => setMessages((pre) => pre.concat(e.data));
  }, [ws])

  return (
    <div>
      <pre>
        {JSON.stringify(messages)}
        {ws !== undefined && <button onClick={() => ws.send('Hello, server!')}>click me!</button>}
      </pre>
    </div>
  );
}

interface TournamentDashboardProps {
  tournamentId: string;
}
