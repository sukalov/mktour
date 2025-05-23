import ClubInbox from '@/app/clubs/my/(tabs)/inbox';
import ClubSettings from '@/app/clubs/my/(tabs)/settings';
import { ClubTabProps } from '@/app/clubs/my/tabMap';
import { InfoItem } from '@/app/tournaments/[id]/dashboard/tabs/main';
import { Card } from '@/components/ui/card';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { CalendarDays, Info } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { FC } from 'react';

const Desktop: FC<ClubTabProps & { club: DatabaseClub }> = ({
  selectedClub,
  userId,
  club,
}) => {
  const locale = useLocale();
  const t = useTranslations('Club.Dashboard');
  const createdAt = club?.created_at?.toLocaleDateString([locale], {
    dateStyle: 'medium',
  });

  return (
    <div>
      <div className="grid h-full gap-8 p-2 pt-2 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <h1 className="mb-2">{t('main')}</h1>
          <Card className="items-left mx-auto flex max-w-[min(640px,100%)] flex-col gap-8 p-4">
            {club.description && (
              <InfoItem icon={Info} value={club.description} />
            )}
            <InfoItem icon={CalendarDays} value={createdAt} />
          </Card>
        </div>
        <div>
          <h1 className="mb-2">{t('inbox')}</h1>
          <Card className="p-4">
            <ClubInbox selectedClub={selectedClub} />
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
