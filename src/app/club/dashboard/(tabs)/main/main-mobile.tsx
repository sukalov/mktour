import { ClubTabProps } from '@/app/club/dashboard/dashboard';
import { InfoItem } from '@/app/tournaments/[id]/dashboard/tabs/main';
import { Card } from '@/components/ui/card';
import { CalendarDays, Info } from 'lucide-react';
import { useLocale } from 'next-intl';
import { FC } from 'react';

const Mobile: FC<ClubTabProps & { club: any }> = ({ club }) => {
  const locale = useLocale();
  const createdAt = club.data?.created_at?.toLocaleDateString([locale], {
    dateStyle: 'medium',
  });

  return (
    <Card className="items-left mx-auto flex max-w-[min(640px,100%)] flex-col gap-8 p-4">
      {club.data.description && (
        <InfoItem icon={Info} value={club.data.description} />
      )}
      <InfoItem icon={CalendarDays} value={createdAt} />
    </Card>
  );
};

export default Mobile;
