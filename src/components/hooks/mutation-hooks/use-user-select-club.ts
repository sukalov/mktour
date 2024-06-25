import { editUser } from '@/lib/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { User } from 'lucia';
import { toast } from 'sonner';

export const useUserSelectClub = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ['select-club'],
    gcTime: 0,
    mutationFn: editUser,
    onError: (_err, _) => {
      toast.error('error happened', {
        id: 'error',
        duration: 3000,
      });
    },
    onMutate: ({ values }) => {
      queryClient.cancelQueries({ queryKey: ['user'] });

      const previousState: User | undefined = queryClient.getQueryData([
        'user',
        'profile',
      ]);

      queryClient.setQueryData(['user', 'profile'], (cache: User) => ({
        ...cache,
        selected_club: values.selected_club,
      }));
      return { previousState };
    },

    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onSuccess: (_err) => {
      console.log('selected club changed');
    },
  });
};
