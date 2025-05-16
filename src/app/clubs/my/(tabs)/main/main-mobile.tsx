import { ClubTabProps } from '@/app/clubs/my/tabMap';
import { InfoItem } from '@/app/tournaments/[id]/dashboard/tabs/main';
import { DatabaseClub } from '@/lib/db/schema/clubs';
import { CalendarDays, Info } from 'lucide-react';
import { useLocale } from 'next-intl';
import { FC } from 'react';

const Mobile: FC<ClubTabProps & { club: DatabaseClub }> = ({ club }) => {
  const locale = useLocale();
  const createdAt = club.created_at?.toLocaleDateString([locale], {
    dateStyle: 'medium',
  });

  return (
    <div className="items-left mx-auto flex max-w-[min(640px,100%)] flex-col gap-4 border-t-2 p-2">
      {club.description && <InfoItem icon={Info} value={club.description} />}
      <InfoItem icon={CalendarDays} value={createdAt} />
    </div>
  );
};

export default Mobile;
