'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import { InfoItem } from '@/app/tournaments/[id]/dashboard/tabs/main';
import Empty from '@/components/empty';
import { useClubInfo } from '@/components/hooks/query-hooks/use-club-info';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, ExternalLink, Info } from 'lucide-react';
import { useLocale } from 'next-intl';
import { FC } from 'react';

const ClubMain: FC<ClubTabProps> = ({ selectedClub }) => {
  const { data: club, isPending } = useClubInfo(selectedClub);
  const locale = useLocale();

  if (isPending) return <Skeleton className="h-24 w-full" />;
  if (!club) return <Empty />;

  const createdAt = club.createdAt.toLocaleDateString([locale], {
    dateStyle: 'medium',
  });

  return (
    <div className="items-left mx-auto flex max-w-[min(640px,100%)] flex-col gap-4 border-t-2 p-2">
      <InfoItem
        icon={ExternalLink}
        value={club.name}
        href={`/clubs/${club.id}`}
      />
      {club.description && <InfoItem icon={Info} value={club.description} />}
      <InfoItem icon={CalendarDays} value={createdAt} />
    </div>
  );
};

export default ClubMain;
