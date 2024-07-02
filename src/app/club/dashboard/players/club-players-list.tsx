import { useClubPlayers } from '@/components/hooks/query-hooks/use-club-players';
import { Card } from '@/components/ui/card';
import { User } from 'lucia';
import { FC } from 'react';

const ClubPlayersList: FC<{ user: User }> = ({ user }) => {
  const players = useClubPlayers(user.selected_club);
  if (players.status === 'pending' || players.status === 'error') return <></>;
  if (players.data?.length < 1)
    return (
      // FIXME Intl
      <div className="mt-8 flex w-full justify-center text-sm text-muted-foreground">
        <p>There are no players in your club yet</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-2">
      {players.data.map(({ nickname, rating, last_seen, id }) => {
        const lastSeen = getFormmatedLastSeen(last_seen);
        const realname = 'Real Name';
        return (
          <Card
            key={id}
            className="flex items-center justify-between truncate p-4"
          >
            <div className="flex flex-col">
              <span>
                {nickname} {realname && `(${realname})`}
              </span>
              <span className="text-xs text-muted-foreground">
                last seen: {lastSeen}
              </span>
            </div>
            <div className="text-2xl">{rating}</div>
          </Card>
        );
      })}
    </div>
  );
};

// FIXME !!! that's what INTL is for ffs !!!
const getFormmatedLastSeen = (num: number | null) => {
  if (!num || num < 1) {
    return `today`;
  }
  if (num >= 1) {
    return `${num} day${num > 1 && 's'} ago`;
  }
};

export default ClubPlayersList;
