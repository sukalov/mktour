import ClubDelete from '@/app/clubs/my/(tabs)/settings/delete-club';
import ClubManagersList from '@/app/clubs/my/(tabs)/settings/managers';
import ClubSettingsForm from '@/app/clubs/my/(tabs)/settings/settings-form';
import { ClubTabProps } from '@/app/clubs/my/tabMap';

export default function ClubSettings({ selectedClub, userId }: ClubTabProps) {
  return (
    <section className="divide-ring mx-auto flex max-w-[min(640px,100%)] flex-col gap-4">
      <ClubSettingsForm selectedClub={selectedClub} userId={userId} />
      <ClubManagersList clubId={selectedClub} userId={userId} />
      <ClubDelete id={selectedClub} userId={userId} />
    </section>
  );
}
