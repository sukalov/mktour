'use client';
// ws-handler global-ws

import { useTRPC } from '@/components/trpc/client';
import { GlobalMessage } from '@/types/ws-events';
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const handleGlobalSocketMessage = (
  message: GlobalMessage,
  queryClient: QueryClient,
  trpc: ReturnType<typeof useTRPC>,
) => {
  switch (message.type) {
    case 'user_notification':
      queryClient.invalidateQueries({
        queryKey: trpc.auth.notifications.infinite.queryKey(),
      });
      break;
    case 'error':
      toast.error(message.message, { id: 'wsErrorMessage' });
    default:
      break;
  }
};
