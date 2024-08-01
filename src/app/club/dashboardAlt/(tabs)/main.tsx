import { ClubTabProps } from '@/app/club/dashboardAlt/dashboard';
import { InfoItem } from '@/app/tournament/dashboard/tabs/main';
import Empty from '@/components/empty';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Info } from 'lucide-react';
import { FC } from 'react';

const ClubMain: FC<ClubTabProps> = ({ selectedClub, isInView }) => {
  const club = useClubInfo(selectedClub);
  if (club.isPending) return <Skeleton className="h-24 w-full" />;
  if (!club.data) return <Empty />;

  const createdAt = club.data?.created_at?.toLocaleDateString(['en-GB'], {
    dateStyle: 'medium',
  });

  return (
    <Card className="items-left flex w-full flex-col gap-8 p-4">
      {club.data.description && (
        <InfoItem icon={<Info />} value={club.data.description} />
      )}
      <InfoItem icon={<CalendarDays />} value={createdAt} />
    </Card>
  );
};

export default ClubMain;
