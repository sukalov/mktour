import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function useDeleteClubMutation(
  queryClient: QueryClient,
  setOpen: Dispatch<SetStateAction<boolean>>,
) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation(
    trpc.club.delete.mutationOptions({
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: trpc.club.pathKey(),
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.user.authClubs.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.user.auth.queryKey(),
        });
        toast.success('club deleted');
        setOpen(false);
      },
      onError: (error) => {
        if (error.message === 'ZERO_CLUBS') {
          toast.error(t('zero clubs error', { id: 'zeroClubsError' }));
        } else {
          toast.error('sorry! server error happened', { id: 'serverError' });
        }
      },
    }),
  );
}
