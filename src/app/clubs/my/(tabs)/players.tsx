'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubPlayers } from '@/components/hooks/query-hooks/use-club-players';
import SkeletonList from '@/components/skeleton-list';
import { Card } from '@/components/ui/card';
import { DatabasePlayer } from '@/server/db/schema/players';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubPlayersList: FC<ClubTabProps> = ({ selectedClub }) => {
  const players = useClubPlayers(selectedClub);
  const t = useTranslations('Empty');

  if (players.status === 'pending' || players.status === 'error')
    return <SkeletonList length={4} />;
  if (players.data.length < 1)
    return <Empty className="justify-start">{t('players')}</Empty>;

  return <div className="mk-list">{players.data.map(PlayerItemIteratee)}</div>;
};

const PlayerItemIteratee = (player: DatabasePlayer) => {
  return <PlayerItem player={player} key={player.id} />;
};

const PlayerItem: FC<{ player: DatabasePlayer }> = ({ player }) => {
  // const t = useTranslations();
  // const formatter = useFormatter();
  const { id, nickname, rating } = player;
  // const lastSeen =
  //   last_seen && last_seen > 0
  //     ? formatter.relativeTime(last_seen)
  //     : t('Player.never');

  return (
    <Link href={`/player/${id}`}>
      <Card
        key={id}
        className="mk-card flex items-center justify-between truncate text-sm"
      >
        <span>{nickname}</span>
        <div className="text-muted-foreground">{rating}</div>
      </Card>
    </Link>
  );
};

export default ClubPlayersList;
