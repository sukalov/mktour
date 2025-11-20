import Loading from '@/app/loading';
import ClaimPlayer from '@/app/player/[id]/claim-button';
import EditButton from '@/app/player/[id]/edit-button';
import FullName from '@/app/player/[id]/fullname';
import LastTournaments from '@/app/player/[id]/last-tournaments';
import FormattedMessage from '@/components/formatted-message';
import { Card } from '@/components/ui/card';
import { publicCaller } from '@/server/api';
import { DatabaseUser } from '@/server/db/schema/users';
import { User2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';

export default async function PlayerPage(props: PlayerPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <PlayerPageContent {...props} />
    </Suspense>
  );
}

async function PlayerPageContent(props: PlayerPageProps) {
  const { id } = await props.params;
  const [user, playerData] = await Promise.all([
    publicCaller.auth.info(),
    publicCaller.player.info({ playerId: id }),
  ]);
  if (!playerData) notFound();
  const { player, club, user: playerUser } = playerData;
  const status = await publicCaller.club.authStatus({
    clubId: club.id,
    userId: user?.id || '',
  });
  const playerLastTournaments =
    await publicCaller.player.playersLastTournaments({
      playerId: player.id,
    });

  const isOwnPlayer = user && player.userId === user.id;
  const canEdit = status || isOwnPlayer;
  const canClaim = !status && user && !player.userId;

  return (
    <div className="mk-container flex w-full flex-col gap-2">
      <div className="pl-mk flex w-full items-center justify-between">
        <div className="flex flex-col">
          <span className="truncate text-xl font-semibold text-wrap">
            {player.nickname}
          </span>
          <UserLink user={playerUser} />
        </div>
        {user && (
          <div className="text-muted-foreground flex self-end">
            {canEdit && (
              <EditButton userId={user.id} player={player} status={status} />
            )}
            {canClaim && <ClaimPlayer userId={user.id} clubId={club.id} />}
          </div>
        )}
      </div>
      <Card className="mk-card flex flex-col gap-2 text-sm">
        <FullName player={player} user={playerUser} />
        <span>
          <FormattedMessage id="Player.rating" />
          {': '}
          {player.rating}
        </span>
        <p>
          <FormattedMessage id="Player.club" />
          {': '}
          <Link className="mk-link" href={`/clubs/${player.clubId}`}>
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
      </Card>
      <LastTournaments tournaments={playerLastTournaments} />
    </div>
  );
}

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
