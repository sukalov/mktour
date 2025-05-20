import ClaimPlayer from '@/app/player/[id]/claim-button';
import DeletePlayer from '@/app/player/[id]/delete-button';
import EditButton from '@/app/player/[id]/edit-button';
import FormattedMessage from '@/components/formatted-message';
import { validateRequest } from '@/lib/auth/lucia';
import { publicCaller } from '@/server/api';
import { DatabasePlayer } from '@/server/db/schema/players';
import { DatabaseUser } from '@/server/db/schema/users';
import { User2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC } from 'react';

export default async function PlayerPage(props: PlayerPageProps) {
  const { id } = await props.params;
  const { user } = await validateRequest();
  const playerData = await publicCaller.player.info({ playerId: id });
  if (!playerData) notFound();
  const { player, club, user: playerUser } = playerData;
  const [userAffiliation, status] = await Promise.all([
    publicCaller.club.authAffiliation({
      clubId: club.id,
    }),
    publicCaller.club.authStatus({ clubId: club.id }),
  ]);

  const isOwnPlayer = user && player.user_id === user.id;
  const canEdit = status || isOwnPlayer;
  const canClaim = !status && user && !player.user_id;

  return (
    <div className="mk-container flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between border-b-2 pb-2 pl-2">
        <div className="flex flex-col">
          <span className="truncate text-2xl font-semibold text-wrap">
            {player.nickname}
          </span>
          <UserLink user={playerUser} />
        </div>
        {user && (
          <div className="text-muted-foreground flex self-end">
            {canEdit && (
              <>
                <EditButton userId={user.id} player={player} />
                {!isOwnPlayer && <DeletePlayer userId={user.id} />}
              </>
            )}
            {canClaim && (
              <ClaimPlayer
                userId={user.id}
                clubId={club.id}
                userAffiliation={userAffiliation}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 pl-2 text-sm">
        <FullName player={player} user={playerUser} />
        <span>
          <FormattedMessage id="Player.rating" />
          {': '}
          {player.rating}
        </span>
        <p>
          <FormattedMessage id="Player.club" />
          {': '}
          <Link className="mk-link" href={`/clubs/${player.club_id}`}>
            {club.name}
          </Link>
        </p>
        {playerUser && (
          <p>
            <FormattedMessage id="Player.lichess" />
            {': '}
            <Link
              href={`https://lichess.org/@/${playerUser.username}`}
              target="_blank"
              className="mk-link"
            >
              {playerUser.username}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

const FullName: FC<{ player: DatabasePlayer; user: DatabaseUser | null }> = ({
  player,
  user,
}) => {
  if (!player.realname && !user?.name) return null;
  return <span className="font-semibold">{user?.name || player.realname}</span>;
};

const UserLink: FC<{ user: DatabaseUser | null }> = ({ user }) => {
  if (!user) return null;
  return (
    <Link href={`/user/${user.username}`}>
      <span className="mk-link text-muted-foreground flex gap-1 truncate text-xs text-wrap">
        <User2 className="size-4" />
        <span>{user.username}</span>
      </span>
    </Link>
  );
};

export interface PlayerPageProps {
  params: Promise<{ id: string }>;
}
