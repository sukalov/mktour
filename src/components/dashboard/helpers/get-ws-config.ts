import { handleSocketMessage } from '@/lib/handle-socket-message';

const getWsConfig = (session: string) => {
  return {
    queryParams: {
      auth_session: session,
    },
    onOpen: () => console.log('opened'),
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
  };
};

export default getWsConfig;
