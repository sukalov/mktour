import ClubSettings from '@/app/club/dashboard/(tabs)/club-settings';
import ClubInbox from '@/app/club/dashboard/(tabs)/inbox';
import { ClubTabProps } from '@/app/club/dashboard/dashboard';
import { InfoItem } from '@/app/tournaments/[id]/dashboard/tabs/main';
import { Card } from '@/components/ui/card';
import { CalendarDays, Info } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { FC } from 'react';

const Desktop: FC<ClubTabProps & { club: any }> = ({
  selectedClub,
  userId,
  club,
}) => {
  const locale = useLocale()
  const t = useTranslations('ClubDashboard')
  const createdAt = club.data?.created_at?.toLocaleDateString([locale], {
    dateStyle: 'medium',
  });

  return (
    <div>
      <div className="grid h-full gap-8 p-2 pt-2 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <h1 className="mb-2">{t('main')}</h1>
          <Card className="items-left mx-auto flex max-w-[min(640px,100%)] flex-col gap-8 p-4">
            {club.data.description && (
              <InfoItem icon={Info} value={club.data.description} />
            )}
            <InfoItem icon={CalendarDays} value={createdAt} />
          </Card>
        </div>
        <div>
          <h1 className="mb-2">{t('inbox')}</h1>
          <Card className="p-4">
            <ClubInbox />
          </Card>
        </div>
        <div>
          <h1 className="mb-2">{t('settings')}</h1>
          <ClubSettings selectedClub={selectedClub} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Desktop;
