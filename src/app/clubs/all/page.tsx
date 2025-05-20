import ClubsIteratee from '@/app/clubs/all/clubs-list';
import Center from '@/components/center';
import getAllClubsQuery from '@/server/queries/get-all-clubs-query';

export default async function ClubSettings() {
  const clubs = await getAllClubsQuery();

  return (
    <Center className="mk-list">
      <ClubsIteratee clubs={clubs} />
    </Center>
  );
}
