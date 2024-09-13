import ClubDelete from '@/app/club/dashboard/(tabs)/club-delete';
import ClubManagersList from '@/app/club/dashboard/(tabs)/club-managers';
import ClubSettingsForm from '@/app/club/dashboard/(tabs)/club-settings-form';
import { ClubTabProps } from '@/app/club/dashboard/dashboard';

export default function ClubSettings({ selectedClub, userId }: ClubTabProps) {
  return (
    <section className="mx-auto flex max-w-[min(640px,100%)] flex-col gap-4">
      <ClubSettingsForm selectedClub={selectedClub} userId={userId} />
      <ClubManagersList id={selectedClub} />
      <ClubDelete id={selectedClub} userId={userId} />
    </section>
  );
}
