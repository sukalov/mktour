import { useTRPC } from '@/components/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useClubLeaveMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.club.leave.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.user.auth.pathKey(),
        });
      },
      onError: (error) => {
        if (error.message === 'CANT_LEAVE_ONLY_CLUB') {
          toast.error('you can not leave the only club you are in');
        } else if (error.message === 'NO_OTHER_CLUB_CO_OWNER') {
          toast.error('you can not leave the only club you are a co-owner of');
        } else {
          toast.error('sorry! server error happened');
        }
      },
    }),
  );
};
