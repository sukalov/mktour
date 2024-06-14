import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function UserRoot() {
  const { user } = await validateRequest()
  if (!user) redirect('/sign-in')
  redirect(`/user/profile/${user.username}`);
}
