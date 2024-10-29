import ClubsList from '@/app/club/all/clubs-list';
import Center from '@/components/center';
import getAllClubsQuery from '@/lib/db/queries/get-all-clubs-query';

export default async function ClubSettings() {
  const clubs = await getAllClubsQuery();

  return (
    <Center className="flex flex-col gap-4">
      <ClubsList clubs={clubs} />
    </Center>
  );
}
