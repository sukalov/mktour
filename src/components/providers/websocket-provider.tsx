'use client';

import { useGlobalWebsocket } from '@/components/hooks/use-global-websocket';
import { GlobalMessage } from '@/types/ws-events';
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

interface GlobalWebSocketProviderProps {
  children: ReactNode;
  session: string;
}

export const GlobalWebSocketProvider = ({
  children,
  session,
}: GlobalWebSocketProviderProps) => {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useGlobalWebsocket(session);

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
