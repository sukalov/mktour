'use client';

import { useTRPC } from '@/components/trpc/client';
import { SOCKET_URL } from '@/lib/config/urls';
import { handleGlobalSocketMessage } from '@/lib/handle-global-socket-messages';
import { GlobalMessage } from '@/types/ws-events';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast } from 'sonner';

export const useGlobalWebsocket = (encryptedAuthSession: string | null) => {
  const t = useTranslations('Toasts');
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const stableOnMessage = useCallback(
    (event: MessageEvent<string>) => {
      if (!event.data) return;
      const message: GlobalMessage = JSON.parse(event.data);
      handleGlobalSocketMessage(message, queryClient, trpc);
    },
    [queryClient, trpc],
  );

  const stableOnReconnectStop = useCallback(() => {
    setTimeout(() => toast.dismiss('wsError'));
    toast.error(t('ws error'), {
      id: 'wsError',
    });
  }, [t]);

  return useWebSocket<GlobalMessage>(`${SOCKET_URL}/global`, {
    protocols:
      encryptedAuthSession && encryptedAuthSession !== ''
        ? encryptedAuthSession
        : 'guest',
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
      message: '',
    },
    onMessage: stableOnMessage,
    reconnectInterval: 3000,
    onReconnectStop: stableOnReconnectStop,
  });
};
