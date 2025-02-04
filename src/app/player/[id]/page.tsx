import ActionButton from '@/app/player/[id]/action-button';
import { validateRequest } from '@/lib/auth/lucia';
import getPlayerQuery from '@/lib/db/queries/get-player-query';
import getStatus from '@/lib/db/queries/get-status-query';
import { StatusInClub } from '@/lib/db/schema/tournaments';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PlayerPage(props: PlayerPageProps) {
  const params = await props.params;
  const { user } = await validateRequest();
  const { player, club } = await getPlayerQuery(params.id);
  if (!player || !club) notFound();
  let status: StatusInClub | undefined | 'owner';
  status = await getStatus({
    user,
    club,
  }); // if defined, this player can be edited by page viewer
  // const isOwner = player.user_id === user?.id; // the viewer of the page is this player
  const isClubOwner = status === 'admin'; // FIXME make Enum
  const isDuplicatingName =
    player.nickname.trim().toLocaleLowerCase().replaceAll(' ', '') ===
    player.realname!.trim().toLocaleLowerCase().replaceAll(' ', '');

  return (
    <div className="flex w-full flex-col gap-2 p-4 pt-2">
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <span className="text-2xl">{player.nickname}</span>
          <ActionButton userId={user!.id} />
        </div>
        {!isDuplicatingName && <span>{player.realname}</span>}
        <span>rating: {player.rating}</span>
        <p>
          club: <Link href={`/clubs/${player.club_id}`}>{club.name}</Link>
        </p>
      </div>
      <div className="text-muted-foreground flex flex-col gap-2 text-sm">
        <p>
          {status
            ? `you can edit this player because he is from ${club.name}`
            : `you cannot edit this player, you are not admin of ${(<strong>{club.name}</strong>)}`}
        </p>
      </div>
    </div>
  );
}


export interface PlayerPageProps {
  params: Promise<{ id: string }>;
}
