import NewClubForm from '@/app/clubs/create/new-club-form';
import { getUser } from '@/lib/auth/utils';
import useUserToClubsQuery from '@/lib/db/hooks/use-user-to-clubs-query';
import { DatabaseClub } from '@/lib/db/schema/tournaments';

export default async function CreateClubPage() {
  const user = await getUser();
  console.log(user)
  const userClubs = await useUserToClubsQuery({ user });
  const preparedUser = userClubs.map((el) => el.club) as DatabaseClub[];

  return (
  <div>
    <NewClubForm user={user} clubs={preparedUser}/>
    </div>);
}
