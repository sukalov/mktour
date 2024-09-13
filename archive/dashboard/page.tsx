import Loading from '@/app/loading';
import { validateRequest } from '@/lib/auth/lucia';
import ClubInfoContent from 'archive/dashboard/club-info-content';

export default async function ClubInfo() {
  const { user } = await validateRequest();
  if (!user) return <Loading />;
  return <ClubInfoContent userId={user.id} />;
}
