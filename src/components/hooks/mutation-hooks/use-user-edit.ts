import { editUser } from '@/lib/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useEditUserMutation(queryClient: QueryClient) {
  return useMutation({
    mutationFn: editUser,
    onSuccess: (_err, data) => {
      toast.success('profile updated!');
      queryClient.invalidateQueries({ queryKey: [data.id, 'user', 'profile'] });
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}
