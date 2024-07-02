import EditProfileForm from '@/app/user/edit/edit-profile-form';
import { validateRequest } from '@/lib/auth/lucia';
import { getUser } from '@/lib/auth/utils';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function EditUserPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
  queryKey: [user.id, 'user', 'profile'],
    queryFn: getUser,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditProfileForm userId={user.id}/>
    </HydrationBoundary>
  );
}
