import { editUser } from '@/lib/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { User } from 'lucia';
import { toast } from 'sonner';

export const useUserSelectClub = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ['select-club'],
    gcTime: 0,
    mutationFn: editUser,
    onError: () => {
      toast.error('error happened', {
        id: 'error',
        duration: 3000,
      });
    },
    onMutate: ({ id, values }) => {
      queryClient.cancelQueries({ queryKey: [id, 'user'] });

      const previousState: User | undefined = queryClient.getQueryData([
        id,
        'user',
        'profile',
      ]);

      queryClient.setQueryData([id, 'user', 'profile'], (cache: User) => ({
        ...cache,
        selected_club: values.selected_club,
      }));
      return { previousState };
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: [id, 'user'] });
    },
  });
};
