import { validateRequest } from '@/lib/auth/lucia';
import TournamentsList from 'archive/dashboard/tournaments/tournaments-list';

export default async function ClubDashboardTournaments() {
  const { user } = await validateRequest();
  if (!user || !user.id) return null;
  return <TournamentsList userId={user.id} />;
}
