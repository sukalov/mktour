import ClubDelete from '@/app/clubs/my/(tabs)/club-delete';
import ClubManagersList from '@/app/clubs/my/(tabs)/club-managers';
import ClubSettingsForm from '@/app/clubs/my/(tabs)/club-settings-form';
import { ClubTabProps } from '@/app/clubs/my/dashboard';

export default function ClubSettings({ selectedClub, userId }: ClubTabProps) {
  return (
    <section className="mx-auto flex max-w-[min(640px,100%)] flex-col gap-4">
      <ClubSettingsForm selectedClub={selectedClub} userId={userId} />
      <ClubManagersList id={selectedClub} />
      <ClubDelete id={selectedClub} userId={userId} />
    </section>
  );
}
