'use client';

import FormattedMessage from '@/components/formatted-message';
import { DatabasePlayer } from '@/server/db/schema/players';
import { DatabaseUser } from '@/server/db/schema/users';

const FullName = ({
  player,
  user,
}: {
  player: DatabasePlayer;
  user: DatabaseUser | null;
}) => {
  let name;
  if (!user && !player.realname) return null;
  if (!user) {
    name = player.realname;
  } else {
    name = user.name ?? player.realname;
  }
  return (
    <div>
      <FormattedMessage id="Player.realname" />
      {': '}
      <span className="font-semibold">{name}</span>
    </div>
  );
};

export default FullName;
