import { editUser } from '@/lib/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserSelectedClub = (queryClient: QueryClient) => {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: editUser,
    onError: (_err, _) => {
      toast.error('error happened', {
        id: 'error',
        duration: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onSuccess: (_err) => {
      console.log('selected club changed');
    },
  });
};
