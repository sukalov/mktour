import { turboPascal } from '@/app/fonts';
import DeleteUser from '@/app/user/edit/delete-user';
import EditProfileForm from '@/app/user/edit/edit-profile-form';
import { validateRequest } from '@/lib/auth/lucia';
import { getUser } from '@/lib/auth/utils';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function EditUserPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [user.id, 'user', 'profile'],
    queryFn: getUser,
  });

  const t = await getTranslations('EditUser');
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <h2
        className={`m-2 text-center text-4xl font-bold ${turboPascal.className}`}
      >
        {t('header')}
      </h2>
      <div className="mx-auto flex max-w-[min(600px,98%)] flex-col gap-4">
        <EditProfileForm userId={user.id} />
        <DeleteUser userId={user.id} />
      </div>
    </HydrationBoundary>
  );
}
