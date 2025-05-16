import ClaimPlayer from '@/app/player/[id]/claim-button';
import DeletePlayer from '@/app/player/[id]/delete-button';
import EditButton from '@/app/player/[id]/edit-button';
import FormattedMessage from '@/components/formatted-message';
import { validateRequest } from '@/lib/auth/lucia';
import getPlayerQuery from '@/lib/db/queries/get-player-query';
import getStatus from '@/lib/db/queries/get-status-query';
import { getUserClubAffiliation } from '@/lib/db/queries/get-user-club-affiliation';
import { StatusInClub } from '@/lib/db/schema/clubs';
import { DatabasePlayer } from '@/lib/db/schema/players';
import { DatabaseUser } from '@/lib/db/schema/users';
import { User2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC } from 'react';

export default async function PlayerPage(props: PlayerPageProps) {
  const params = await props.params;
  const { user } = await validateRequest();
  const { player, club, user: playerUser } = await getPlayerQuery(params.id);
  const userAffiliation = await getUserClubAffiliation(user, club.id); // NB: this won't return approved afiiliations yet

  if (!player || !club) notFound();

  const status: StatusInClub | undefined = user
    ? await getStatus({ user, clubId: club.id })
    : undefined;

  const isOwnPlayer = user && player.user_id === user.id;
  const canEdit = status || isOwnPlayer;
  const canClaim = !status && user && !player.user_id && !userAffiliation;

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
            {canClaim && <ClaimPlayer userId={user.id} clubId={club.id} />}
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
