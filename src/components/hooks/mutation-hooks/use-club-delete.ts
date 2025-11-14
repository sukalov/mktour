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
      onSuccess: (_, { clubId }) => {
        queryClient.removeQueries({
          predicate: (query) =>
            query.queryKey[0] === 'club' &&
            typeof query.queryKey[2] === 'object' &&
            query.queryKey[2] !== null &&
            'clubId' in query.queryKey[2] &&
            query.queryKey[2].clubId === clubId,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.auth.pathKey(),
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
