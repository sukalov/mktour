import { editUser } from '@/lib/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
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
    onMutate: () => {
      queryClient.cancelQueries({queryKey: ['user', 'clubs']})
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'clubs'] });
    },
    onSuccess: (_err) => {
      console.log('selected club changed');
    },
  });
};
