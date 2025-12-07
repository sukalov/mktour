'use client';

import { useTRPC } from '@/components/trpc/client';
import { SOCKET_URL } from '@/lib/config/urls';
import { handleGlobalSocketMessage } from '@/lib/handle-global-socket-messages';
import { GlobalMessage } from '@/types/ws-events';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast } from 'sonner';

export const useGlobalWebsocket = (
  encryptedAuthSession: string | undefined,
) => {
  const t = useTranslations('Toasts');
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const stableOnMessage = useRef((event: MessageEvent<string>) => {
    if (!event.data) return;
    const message: GlobalMessage = JSON.parse(event.data);
    handleGlobalSocketMessage(message, queryClient, trpc);
  });

  stableOnMessage.current = (event: MessageEvent<string>) => {
    if (!event.data) return;
    const message: GlobalMessage = JSON.parse(event.data);
    handleGlobalSocketMessage(message, queryClient, trpc);
  };

  const stableOnReconnectStop = useRef(() => {
    setTimeout(() => toast.dismiss('wsError'));
    toast.error(t('ws error'), {
      id: 'wsError',
    });
  });

  stableOnReconnectStop.current = () => {
    setTimeout(() => toast.dismiss('wsError'));
    toast.error(t('ws error'), {
      id: 'wsError',
    });
  };

  return useWebSocket<GlobalMessage>(`${SOCKET_URL}/global`, {
    protocols: encryptedAuthSession !== '' ? encryptedAuthSession : 'guest',
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
      message: '',
    },
    onMessage: stableOnMessage.current,
    reconnectInterval: 3000,
    onReconnectStop: stableOnReconnectStop.current,
  });
};
