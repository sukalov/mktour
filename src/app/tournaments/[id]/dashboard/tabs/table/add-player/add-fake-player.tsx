import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import { useTournamentAddNewPlayer } from '@/components/hooks/mutation-hooks/use-tournament-add-new-player';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Button } from '@/components/ui/button';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { faker } from '@faker-js/faker';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { FC, useContext } from 'react';

const AddFakerPlayer: FC<{ setOpen: (_arg: boolean) => void }> = ({
  setOpen,
}) => {
  const id = usePathname().split('/').at(-1) as string;
  const tournament = useTournamentInfo(id);
  const queryClient = useQueryClient();
  const returnToNewPlayer = () => null;
  const { sendJsonMessage, userId } = useContext(DashboardContext);
  const { mutate } = useTournamentAddNewPlayer(
    id,
    queryClient,
    sendJsonMessage,
    returnToNewPlayer,
  );

  const nickname = Math.round(Math.random()) > 0 
    ? faker.internet.username()
    : faker.person.fullName()

  const player: DatabasePlayer = {
    id: faker.string.uuid(),
    nickname,
    realname: null,
    club_id: tournament.data?.club?.id!,
    user_id: null,
    rating: faker.number.int({ min: 100, max: 3000 }),
    last_seen: null,
  };

  const onClick = () => {
    setOpen(false);
    mutate({
      player,
      tournamentId: tournament.data?.tournament.id!,
      userId: userId!,
    });
  };

  return (
    <Button onClick={onClick} variant="secondary">
      Add faker player (DEV)
    </Button>
  );
};

export default AddFakerPlayer;
