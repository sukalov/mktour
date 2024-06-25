import EditProfileForm from '@/app/user/edit/edit-profile-form';
import { getUser } from '@/lib/auth/utils';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

export default async function EditUserPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUser,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditProfileForm />
    </HydrationBoundary>
  );
}
