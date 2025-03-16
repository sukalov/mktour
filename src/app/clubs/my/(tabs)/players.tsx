'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubPlayers } from '@/components/hooks/query-hooks/use-club-players';
import SkeletonList from '@/components/skeleton-list';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubPlayersList: FC<ClubTabProps> = ({ selectedClub }) => {
  const players = useClubPlayers(selectedClub);
  const t = useTranslations('Empty');

  if (players.status === 'pending' || players.status === 'error')
    return <SkeletonList length={4} />;
  if (players.data?.length < 1)
    return <Empty className="justify-start">{t('players')}</Empty>;

  return <div className='flex flex-col gap-2 overflow-hidden'>{players.data.map(PlayerItemIteratee)}</div>
};

const PlayerItemIteratee = (player: PlayerProps) => {
  return <PlayerItem player={player} key={player.id} />;
};

const PlayerItem: FC<{ player: PlayerProps }> = ({ player }) => {
  // const t = useTranslations();
  // const formatter = useFormatter();
  const { last_seen, id, nickname, rating } = player;
  // const lastSeen =
  //   last_seen && last_seen > 0
  //     ? formatter.relativeTime(last_seen)
  //     : t('Player.never');

  return (
    <Card
      key={id}
      className="mk-card flex items-center justify-between truncate"
    >
      <Link href={`/player/${id}`}>
        <div className="flex flex-col truncate text-wrap">
          <span>{nickname}</span>
          {/* <span className="text-xs">{realname && `(${realname})`}</span> */}
          {/* <span className="text-muted-foreground text-xs">
            {t('Player.last seen') + lastSeen}
          </span> */}
        </div>
      </Link>
      <div className="text-xl">{rating}</div>
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
