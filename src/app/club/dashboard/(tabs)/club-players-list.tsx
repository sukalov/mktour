'use client';

import { ClubTabProps } from '@/app/club/dashboard/dashboard';
import Empty from '@/components/empty';
import { useClubPlayers } from '@/components/hooks/query-hooks/use-club-players';
import SkeletonList from '@/components/skeleton-list';
import { Card } from '@/components/ui/card';
import { useFormatter, useTranslations } from 'next-intl';
import { FC } from 'react';

const ClubPlayersList: FC<ClubTabProps> = ({ selectedClub }) => {
  const players = useClubPlayers(selectedClub);
  const t = useTranslations('Empty');

  if (players.status === 'pending' || players.status === 'error')
    return <SkeletonList length={4} />;
  if (players.data?.length < 1) return <Empty>{t('players')}</Empty>;

  return (
    <div className="flex flex-col gap-2">{players.data.map(PlayerItem)}</div>
  );
};

const PlayerItem = ({ nickname, rating, last_seen, id, realname }: PlayerProps) => {
  const t = useTranslations()
  const formatter = useFormatter();
  const lastSeen = last_seen && last_seen > 0 
    ? formatter.relativeTime(last_seen) 
    : t('Player.never');
  
  return (
    <Card key={id} className="flex items-center justify-between truncate p-4">
      <div className="flex flex-col truncate">
        <span>{nickname}</span>
        <span className="text-xs">{realname && `(${realname})`}</span>
        <span className="text-xs text-muted-foreground">
          {t('Player.last seen') + lastSeen}
        </span>
      </div>
      <div className="text-2xl">{rating}</div>
    </Card>
  );
};

type PlayerProps = {
  id: string;
  nickname: string;
  realname: string | null;
  user_id: string | null;
  rating: number | null;
  club_id: string;
  last_seen: number | null;
};

export default ClubPlayersList;
