import ClubsIteratee from '@/app/clubs/all/clubs-list';
import Center from '@/components/center';
import { publicCaller } from '@/server/api';

export default async function ClubSettings() {
  const clubs = await publicCaller.club.all();

  return (
    <Center className="mk-list mk-container">
      <ClubsIteratee clubs={clubs} />
    </Center>
  );
}
