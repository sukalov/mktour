import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function ClubPage() {
  const { user } = await validateRequest();
  if (user) redirect(`/clubs/${user.default_club}`);
  return <div>no user</div>;
}
