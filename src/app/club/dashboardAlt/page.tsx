import Dashboard from '@/app/club/dashboardAlt/dashboard';
import Loading from '@/app/loading';
import { validateRequest } from '@/lib/auth/lucia';

export default async function ClubInfo() {
  const { user } = await validateRequest();
  if (!user) return <Loading />;
  return <Dashboard userId={user.id} />;
}
