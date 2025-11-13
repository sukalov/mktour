'use client';

import { useGlobalWebsocket } from '@/components/hooks/use-global-websocket';
import { useTRPC } from '@/components/trpc/client';
import { GlobalMessage } from '@/types/ws-events';
import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';

type GlobalWebSocketContextType = {
  sendJsonMessage: (message: GlobalMessage) => void;
  lastJsonMessage: GlobalMessage | null;
  readyState: number;
};

const GlobalWebSocketContext = createContext<GlobalWebSocketContextType>({
  sendJsonMessage: () => null,
  lastJsonMessage: null,
  readyState: -1,
});

export const useGlobalWebSocketContext = () =>
  useContext(GlobalWebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const GlobalWebSocketProvider = ({
  children,
}: WebSocketProviderProps) => {
  const trpc = useTRPC();
  const { data: encryptedSession, isLoading } = useQuery({
    ...trpc.user.auth.encryptedSession.queryOptions(),
    enabled: typeof window !== 'undefined',
    staleTime: Infinity,
    retry: 3,
  });

  // While loading or no session, provide stub context without WebSocket
  if (isLoading || !encryptedSession) {
    return (
      <GlobalWebSocketContext.Provider
        value={{
          sendJsonMessage: () => null,
          lastJsonMessage: null,
          readyState: -1,
        }}
      >
        {children}
      </GlobalWebSocketContext.Provider>
    );
  }

  return (
    <WebsocketProvider encryptedSession={encryptedSession}>
      {children}
    </WebsocketProvider>
  );
};

const WebsocketProvider = ({
  children,
  encryptedSession,
}: {
  children: ReactNode;
  encryptedSession: string;
}) => {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useGlobalWebsocket(encryptedSession);
  return (
    <GlobalWebSocketContext.Provider
      value={{
        sendJsonMessage,
        lastJsonMessage,
        readyState,
      }}
    >
      {children}
    </GlobalWebSocketContext.Provider>
  );
};

export default WebsocketProvider;
