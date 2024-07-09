import TournamentsList from '@/app/club/dashboard/tournaments/tournaments-list';
import { validateRequest } from '@/lib/auth/lucia';

export default async function ClubDashboardTournaments() {
  const { user } = await validateRequest();
  if (!user || !user.id) return null;
  return <TournamentsList userId={user.id} />;
}
