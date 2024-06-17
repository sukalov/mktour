import { SOCKET_URL } from '@/lib/config/urls';
import { handleSocketMessage } from '@/lib/handle-socket-message';
import { QueryClient } from '@tanstack/react-query';
import useWebSocket from 'react-use-websocket';
import { toast } from 'sonner';

export const useDashboardWebsocket = (
  session: string,
  id: string,
  queryClient: QueryClient,
) => {
  return useWebSocket(`${SOCKET_URL}/${id}`, {
    queryParams: {
      auth_session: session,
    },
    onOpen: () => {
      setTimeout(() => toast.dismiss('wsError'));
      toast.success('connected to server!', {
        id: 'wsSuccess',
      });
    },
    shouldReconnect: () => true,
    heartbeat: {
      interval: 5000,
      message: '',
    },
    onMessage: (event: MessageEvent<any>) => {
      if (!event.data) return;
      const message = JSON.parse(event.data);
      handleSocketMessage(message, queryClient, id);
    },
    onError: () => {
      setTimeout(() => toast.dismiss('wsSuccess'));
    },
    onReconnectStop: () => {
      setTimeout(() => toast.dismiss('wsError'));
      toast.error(
        'please reload. in case your connection is stable, consider reporting the bug',
        {
          id: 'wsFinalError',
        },
      );
    },
  });
};
