import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useEditClubMutation(queryClient: QueryClient) {
  const trpc = useTRPC();
  return useMutation(
    trpc.club.edit.mutationOptions({
      onSuccess: () => {
        toast.success('club updated');
        queryClient.invalidateQueries({ queryKey: trpc.club.info.queryKey() });
        queryClient.invalidateQueries({
          queryKey: trpc.user.auth.clubs.queryKey(),
        });
      },
      onError: () => toast.error('sorry! server error happened'),
    }),
  );
}
