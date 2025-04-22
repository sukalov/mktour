import DeletePlayer from '@/app/player/[id]/delete-button';
import EditButton from '@/app/player/[id]/edit-button';
import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import { validateRequest } from '@/lib/auth/lucia';
import getPlayerQuery from '@/lib/db/queries/get-player-query';
import getStatus from '@/lib/db/queries/get-status-query';
import { StatusInClub } from '@/lib/db/schema/tournaments';
import { Pointer } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PlayerPage(props: PlayerPageProps) {
  const params = await props.params;
  const { user } = await validateRequest();
  const { player, club } = await getPlayerQuery(params.id);
  if (!player || !club) notFound();

  console.log(player);
  let status: StatusInClub | undefined | 'owner';
  status = user ? await getStatus({ user, club }) : undefined;

  const isOwnPlayer = user && player.user_id === user.id;
  const canEdit = status === 'admin' || isOwnPlayer;
  const canClaim = user && !player.user_id;

  return (
    <div className="flex w-full flex-col gap-4 p-4 pt-2">
      <div className="flex w-full items-center justify-between border-b-2 pb-2">
        <span className="truncate text-2xl font-semibold text-wrap">
          {player.nickname}
        </span>
        {user && (
          <div className="text-muted-foreground flex self-end">
            {canEdit && (
              <>
                <EditButton userId={user.id} player={player} />
                <DeletePlayer userId={user.id} />
              </>
            )}
            {canClaim && (
              <Button variant="ghost" className="flex gap-2 p-2">
                <Pointer />
                <div className="text-[10px] text-nowrap">
                  <FormattedMessage id="Player.itsMe" />
                </div>
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {player.realname && <span className="text-lg">{player.realname}</span>}
        <span>
          <FormattedMessage id="Player.rating" />
          {': '}
          {player.rating}
        </span>
        <p>
          <FormattedMessage id="Player.club" />
          {': '}
          <Link href={`/clubs/${player.club_id}`}>{club.name}</Link>
        </p>
        {player.user_id && (
          <p>
            <FormattedMessage id="Player.lichess" />
            {': '}
            <Link
              href={`https://lichess.org/@/${player.nickname}`}
              target="_blank"
            >
              {player.nickname}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export interface PlayerPageProps {
  params: Promise<{ id: string }>;
}
