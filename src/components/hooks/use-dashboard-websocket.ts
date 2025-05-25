import { useTRPC } from '@/components/trpc/client';
import { SOCKET_URL } from '@/lib/config/urls';
import { handleSocketMessage } from '@/lib/handle-dashboard-socket-message';

import { DashboardMessage } from '@/types/ws-events';
import { QueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast } from 'sonner';

export const useDashboardWebsocket = (
  session: string,
  id: string,
  queryClient: QueryClient,
  setRoundInView: Dispatch<SetStateAction<number>>,
) => {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  const protocols = session !== '' ? session : 'guest';
  return useWebSocket(`${SOCKET_URL}/tournament/${id}`, {
    protocols,
    onOpen: () => {
      setTimeout(() => toast.dismiss('wsError'));
      toast.success(t('ws success'), {
        id: 'wsSuccess',
      });
    },
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
      message: '',
    },

    onMessage: (event: MessageEvent<string>) => {
      if (!event.data) return;
      const message: DashboardMessage = JSON.parse(event.data);
      handleSocketMessage(
        message,
        queryClient,
        id,
        t('ws message error'),
        setRoundInView,
        trpc,
      );
    },
    onError: () => {
      setTimeout(() => toast.dismiss('wsSuccess'));
    },
    reconnectInterval: 3000,
    onReconnectStop: () => {
      setTimeout(() => toast.dismiss('wsError'));
      toast.error(t('ws error'), {
        id: 'wsError',
      });
    },
  });
};
