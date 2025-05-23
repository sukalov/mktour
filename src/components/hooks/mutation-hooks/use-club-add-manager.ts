import { useTRPC } from '@/components/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useClubAddManagerMutation = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.club.managers.add.mutationOptions({
      onSuccess: () => {
        toast.success('manager added');
        queryClient.invalidateQueries({
          queryKey: trpc.club.managers.all.queryKey(),
        });
      },
      onError: () => toast.error('sorry! server error happened'),
    }),
  );
};
