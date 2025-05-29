import { publicCaller } from '@/server/api';
import { redirect } from 'next/navigation';

const UserPage = async () => {
  const user = await publicCaller.user.auth();
  if (!user) redirect('/sign-in');
  redirect(`/user/${user.username}`);
};

export default UserPage;
