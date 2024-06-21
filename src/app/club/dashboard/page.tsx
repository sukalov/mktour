import ClubInfo from '@/app/club/dashboard/club-info';
import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function ClubInfoPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/club/all');
  return <ClubInfo user={user} />;
}
