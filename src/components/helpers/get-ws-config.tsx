import { handleSocketMessage } from '@/lib/handle-socket-message';
import { Loader2 } from 'lucide-react';
import { Options } from 'react-use-websocket';
import { toast } from 'sonner';

const getWsConfig = (session: string): Options => {
  return {
    queryParams: {
      auth_session: session,
    },
    onOpen: () => {
      setTimeout(() => toast.dismiss('wsError'));
      toast.success('connected to server!', {
        closeButton: true,
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
      handleSocketMessage(message);
    },
    onError: () => {
      setTimeout(() => toast.dismiss('wsSuccess'));
      toast.error(
        <div className="">
          <Loader2 className="inline animate-spin" /> &nbsp; connection error!
          server is offline
        </div>,
        {
          id: 'wsError',
          duration: 200000
        },
      );
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
  };
};

export default getWsConfig;
