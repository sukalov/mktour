import Main from '@/app/club/dashboard/main';
import { validateRequest } from '@/lib/auth/lucia';
import useUserToClubsQuery from '@/lib/db/hooks/use-user-to-clubs-query';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { User } from 'lucia';

export default async function ClubPage() {
  const { user } = await validateRequest() as { user: User }
  const userClubs = await useUserToClubsQuery({ user });
  const clubs = userClubs.map((club) => club.club) as DatabaseClub[];
  return <Main clubs={clubs} selected={user.selected_club} user={user} />;
}
