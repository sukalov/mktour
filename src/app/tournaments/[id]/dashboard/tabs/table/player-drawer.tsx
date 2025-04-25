import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import {
  DeleteButton,
  WithdrawButtonWithConfirmation,
} from '@/app/tournaments/[id]/dashboard/tabs/table/destructive-buttons';
import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import {
  Close,
  Content,
  Description,
  Header,
  Root,
  Title,
} from '@/components/ui/combo-modal';
import { PlayerModel } from '@/types/tournaments';
import { UserRound } from 'lucide-react';
import Link from 'next/link';
import { FC, useContext, useEffect, useState } from 'react';

const PlayerDrawer: FC<{
  player: PlayerModel;
  setSelectedPlayer: (_arg: null) => void;
  handleDelete: () => void;
  hasEnded: boolean;
  hasStarted: boolean;
}> = ({ player, setSelectedPlayer, hasEnded, hasStarted, handleDelete }) => {
  const [open, setOpen] = useState(!!player);
  const { status } = useContext(DashboardContext);

  const DestructiveButton = () => {
    if (hasEnded) return null;
    // prettier-ignore
    return hasStarted 
      ? <WithdrawButtonWithConfirmation selectedPlayer={player} />
      : <DeleteButton handleDelete={() => { setOpen(false); handleDelete() }} />;
  };

  useEffect(() => setOpen(!!player), [player]);

  return (
    <Root
      open={open}
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      onAnimationEnd={() => setSelectedPlayer(null)}
    >
      <Content>
        <Header>
          <Title>{player?.nickname}</Title>
          <Description hidden />
        </Header>
        <Link href={`/player/${player?.id}`}>
          <Button className="flex w-full gap-2" size="lg">
            <UserRound />
            <FormattedMessage id="Tournament.Table.Player.profile" />
          </Button>
        </Link>
        {status === 'organizer' && <DestructiveButton />}
        <Close asChild>
          <Button size="lg" variant="outline">
            <FormattedMessage id="Common.close" />
          </Button>
        </Close>
      </Content>
    </Root>
  );
};

export default PlayerDrawer;
