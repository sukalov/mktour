import ClubInbox from '@/app/clubs/my/(tabs)/inbox';
import ClubSettings from '@/app/clubs/my/(tabs)/settings';
import { ClubTabProps } from '@/app/clubs/my/tabMap';
import { InfoItem } from '@/app/tournaments/[id]/dashboard/tabs/main';
import { Card } from '@/components/ui/card';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { CalendarDays, Info } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { FC, PropsWithChildren } from 'react';

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
      <div className="grid h-full w-full grid-cols-1 gap-8">
        <div>
          <BlockTitle>{t('main')}</BlockTitle>
          <Card className="items-left flex max-w-[min(640px,100%)] flex-col gap-8 p-4">
            {club.description && (
              <InfoItem icon={Info} value={club.description} />
            )}
            <InfoItem icon={CalendarDays} value={createdAt} />
          </Card>
        </div>
        <div>
          <BlockTitle>{t('inbox')}</BlockTitle>
          <ClubInbox selectedClub={selectedClub} />
        </div>
        <div>
          <BlockTitle>{t('settings')}</BlockTitle>
          <ClubSettings selectedClub={selectedClub} userId={userId} />
        </div>
      </div>
    </div>
  );
};

const BlockTitle: FC<PropsWithChildren> = ({ children }) => (
  <h1 className="mb-2 pl-3">{children}</h1>
);

export default Desktop;
