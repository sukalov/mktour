'use client';

import { ClubTabProps } from '@/app/clubs/my/tabMap';
import Empty from '@/components/empty';
import { useClubPlayers } from '@/components/hooks/query-hooks/use-club-players';
import useOnReach from '@/components/hooks/use-on-reach';
import SkeletonList from '@/components/skeleton-list';
import { Card } from '@/components/ui/card';
import { DatabasePlayer } from '@/server/db/schema/players';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

const ClubPlayersList: FC<ClubTabProps> = ({ selectedClub }) => {
  const { fetchNextPage, ...players } = useClubPlayers(selectedClub);
  const t = useTranslations('Empty');
  const triggerRef = useOnReach(() => {
    if (players.hasNextPage && !players.isFetchingNextPage) {
      fetchNextPage();
    }
  });
  const playersData = players.data?.pages.flatMap((page) => page.players) ?? [];

  if (players.status === 'pending' || players.status === 'error')
    return <SkeletonList length={4} className="h-14 rounded-xl" />;
  if (!playersData.length) {
    return <Empty className="text-center text-balance">{t('players')}</Empty>;
  }

  return (
    <div className="mk-list">
      <div className="mk-list">{playersData.map(PlayerItemIteratee)}</div>
      <div>
        <div
          ref={triggerRef}
          className="h-0 w-full -translate-y-[calc(var(--spacing-mk-card-height)+calc((var(--spacing-mk)*2)))]"
        />

        {players.isFetchingNextPage && (
          <div className="-mt-18">
            <SkeletonList length={3} className="h-14 rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerItemIteratee = (player: DatabasePlayer) => {
  return <PlayerItem player={player} key={player.id} />;
};

const PlayerItem: FC<{ player: DatabasePlayer }> = ({ player }) => {
  // const t = useTranslations();
  // const formatter = useFormatter();
  const { id, nickname, rating } = player;
  // const lastSeenAt =
  //   last_seen && last_seen > 0
  //     ? formatter.relativeTime(last_seen)
  //     : t('Player.never');

  return (
    <Link href={`/player/${id}`}>
      <Card
        key={id}
        className="mk-card flex items-center justify-between truncate"
      >
        <span className="text-sm">{nickname}</span>
        <div className="text-muted-foreground text-xs">{rating}</div>
      </Card>
    </Link>
  );
};

export default ClubPlayersList;
