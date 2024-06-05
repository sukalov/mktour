import EditProfileForm from '@/app/user/edit/edit-profile-form';
import { getUser } from '@/lib/auth/utils';

export default async function EditUserPage() {
  const user = await getUser();

  return (
    <EditProfileForm user={user} />
  );
}
