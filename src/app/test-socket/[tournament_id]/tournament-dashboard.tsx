"use client";

import { FormEventHandler, useEffect, useState } from "react";
import usePartySocket from "partysocket/react";
import PartySocket from "partysocket";
import Link from "next/link";
import { User } from "lucia";
// import ConnectionStatus from "@/app/components/ConnectionStatus";

const identify = async (socket: PartySocket) => {
  const url = `${window.location.pathname}/auth?_pk=${socket._pk}`;
  const req = await fetch(url, { method: "POST" });
  if (!req.ok) {
    const res = await req.text();
    console.error("Failed to authenticate connection to PartyKit room", res);
  }
};

const TournamentDashboard: React.FC<{
  room: string;
  host: string;
  user: User | null;
  party: string;
  messages: Message[];
}> = ({ room, host, user: initialUser, party, messages: initialMessages }) => {
  // render with initial data, update from websocket as messages arrive
  const [messages, setMessages] = useState(initialMessages);
  const [user, setUser] = useState(initialUser);
  const socket = usePartySocket({
    host,
    party,
    room,
    onOpen(e) {
      // identify user upon connection
      if (user && e.target) {
        identify(e.target as PartySocket);
        if (user) setUser(user as User);
      }
    },
    onMessage(event: MessageEvent<string>) {
      const message = JSON.parse(event.data) as ChatMessage;
      // upon connection, the server will send all messages in the room
      if (message.type === "sync") setMessages(message.messages);
      // after that, the server will send updates as they arrive
      if (message.type === "new") setMessages((prev) => [...prev, message]);
      if (message.type === "clear") setMessages([]);
      if (message.type === "edit") {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? message : m))
        );
      }
    },
  });

  // authenticate connection to the partykit room if session status changes
  useEffect(() => {
    if (
      user &&
      socket?.readyState === socket.OPEN
    ) {
      identify(socket);
    }
  }, [user, socket]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const text = event.currentTarget.message.value;
    if (text?.trim()) {
      socket.send(JSON.stringify({ type: "new", text }));
      event.currentTarget.message.value = "";
    }
  };


  return (
    <>
      <div className="h-full w-full flex flex-col gap-6">
koko
      </div>
      {/* <ConnectionStatus socket={socket} /> */}
    </>
  );
};

export default TournamentDashboard;
