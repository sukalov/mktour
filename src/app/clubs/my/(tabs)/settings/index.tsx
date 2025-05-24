import ClubDelete from '@/app/clubs/my/(tabs)/settings/delete-club';
import ClubManagersList from '@/app/clubs/my/(tabs)/settings/managers';
import ClubSettingsForm from '@/app/clubs/my/(tabs)/settings/settings-form';
import { ClubTabProps } from '@/app/clubs/my/tabMap';
import { LoadingSpinner } from '@/app/loading';
import { useClubLeaveMutation } from '@/components/hooks/mutation-hooks/use-club-leave';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DoorOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ClubSettings({ selectedClub, userId }: ClubTabProps) {
  const t = useTranslations('Club.Dashboard');
  const { mutate, isPending } = useClubLeaveMutation();
  return (
    <section className="divide-ring mx-auto flex max-w-[min(640px,100%)] flex-col gap-12 p-2">
      <ClubSettingsForm selectedClub={selectedClub} userId={userId} />
      <ClubManagersList clubId={selectedClub} userId={userId} />
      <div className="flex flex-col gap-2 sm:px-0">
        <div className="pl-4 font-bold">{t('danger zone')}</div>
        <Card className="border-none shadow-none sm:border-solid sm:shadow-2xs">
          <CardContent className="flex flex-col gap-2 max-sm:p-0 sm:py-8">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => mutate({ clubId: selectedClub })}
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner /> : <DoorOpen />}
              &nbsp;
              {t('leave club')}
            </Button>
            <ClubDelete id={selectedClub} userId={userId} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
