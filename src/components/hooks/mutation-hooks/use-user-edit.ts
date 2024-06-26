import { editUser } from "@/lib/actions/profile-managing";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useEditUserMutation(queryClient: QueryClient) {
  return useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      toast.success('profile updated!');
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}
