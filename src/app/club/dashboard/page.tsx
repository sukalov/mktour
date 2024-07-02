import ClubInfoContent from '@/app/club/dashboard/club-info-content';
import Loading from '@/app/loading';
import { validateRequest } from '@/lib/auth/lucia';

export default async function ClubInfo() {
  const { user } = await validateRequest();
  if (!user) return <Loading />;
  return <ClubInfoContent userId={user.id} />;
}
