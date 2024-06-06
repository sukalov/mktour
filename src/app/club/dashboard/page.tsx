import Main from '@/app/club/dashboard/main';
import { getUser } from '@/lib/auth/utils';
import useUserToClubsQuery from '@/lib/db/hooks/use-user-to-clubs-query';
import { DatabaseClub } from '@/lib/db/schema/tournaments';

export default async function ClubPage() {
  const user = await getUser();
  const userClubs = await useUserToClubsQuery({ user });
  const clubs = userClubs.map((club) => club.club) as DatabaseClub[];
  return <Main clubs={clubs} selected={user.selected_club} user={user} />;
}
