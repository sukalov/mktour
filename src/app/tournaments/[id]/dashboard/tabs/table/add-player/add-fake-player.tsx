import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import { useTournamentAddNewPlayer } from '@/components/hooks/mutation-hooks/use-tournament-add-new-player';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Button } from '@/components/ui/button';
import { newid } from '@/lib/utils';
import { DatabasePlayer } from '@/server/db/schema/players';
import { faker } from '@faker-js/faker';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { FC, useContext } from 'react';

const AddFakerPlayer: FC<{ setOpen: (_arg: boolean) => void }> = ({
  setOpen,
}) => {
  const { id } = useParams<{ id: string }>();
  const tournament = useTournamentInfo(id);
  const queryClient = useQueryClient();
  const returnToNewPlayer = () => null;
  const { sendJsonMessage, userId } = useContext(DashboardContext);
  if (!userId) throw new Error('USERID_NOT_FOUND_IN_CONTEXT');
  const { mutate } = useTournamentAddNewPlayer(
    id,
    queryClient,
    sendJsonMessage,
    returnToNewPlayer,
  );

  const nickname =
    // eslint-disable-next-line
    Math.round(Math.random()) > 0
      ? faker.internet.username()
      : faker.person.fullName();

  const player: DatabasePlayer = {
    id: newid(),
    nickname,
    realname: null,
    club_id: tournament.data?.club?.id || '',
    user_id: null,
    rating: faker.number.int({ min: 100, max: 3000 }),
    last_seen: null,
  };

  const onClick = () => {
    setOpen(false);
    mutate({
      player,
      tournamentId: tournament.data?.tournament.id || '',
      userId,
    });
  };

  return (
    <Button onClick={onClick} variant="secondary">
      Add faker player (DEV)
    </Button>
  );
};

export default AddFakerPlayer;
