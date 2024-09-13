import ClubsList from '@/app/club/all/clubs-list';
import Center from '@/components/center';
import useAllClubsQuery from '@/lib/db/hooks/use-all-clubs-query';

export default async function ClubSettings() {
  const clubs = await useAllClubsQuery();

  return (
    <Center className="flex flex-col gap-4">
      <ClubsList clubs={clubs} />
    </Center>
  );
}
