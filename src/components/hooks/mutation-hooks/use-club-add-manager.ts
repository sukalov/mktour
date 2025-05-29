import { useGlobalWebSocketContext } from '@/components/providers/websocket-provider';
import { useTRPC } from '@/components/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useClubAddManagerMutation = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { sendJsonMessage } = useGlobalWebSocketContext();
  return useMutation(
    trpc.club.managers.add.mutationOptions({
      onSuccess: (_data, { userId }) => {
        toast.success('manager added');
        queryClient.invalidateQueries({
          queryKey: trpc.club.managers.all.queryKey(),
        });
        sendJsonMessage({ type: 'user_notification', recipientId: userId });
      },
      onError: () => toast.error('sorry! server error happened'),
    }),
  );
};
