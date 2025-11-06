import ClubDelete from '@/app/clubs/my/(tabs)/settings/delete-club';
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
    <section className="md:no-scrollbar max-md:p-mk gap-mk-2 top-20 right-0 left-0 m-auto flex w-full max-w-[min(640px,100%)] flex-col justify-between p-0 pb-16 max-md:pb-16 max-sm:absolute">
      <ClubSettingsForm selectedClub={selectedClub} userId={userId} />
      <div className="flex flex-col gap-2">
        <label htmlFor="danger-zone">
          <h2 className="pl-4 text-sm">{t('danger zone')}</h2>
        </label>
        <Card
          key="danger-zone"
          className="border-none shadow-none sm:border-solid sm:shadow-2xs"
        >
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
