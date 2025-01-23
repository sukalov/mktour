import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { PlayerModel } from '@/types/tournaments';
import { UserRound } from 'lucide-react';
import Link from 'next/link';
import { FC, ReactElement } from 'react';

const PlayerDrawer: FC<{
  player: PlayerModel | null;
  setSelectedPlayer: (_arg: null) => void;
  onDelete: () => void;
  destructiveButton: ReactElement;
}> = ({ player, setSelectedPlayer, destructiveButton }) => (
  <Drawer open={!!player} onClose={() => setSelectedPlayer(null)}>
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>{player?.nickname}</DrawerTitle>
        <DrawerDescription />
      </DrawerHeader>
      <div className="flex w-full flex-col gap-4 p-4 pt-0">
        <Link href={`/player/${player?.id}`}>
          <Button className="flex w-full gap-2" size="lg">
            <UserRound />
            <FormattedMessage id="Tournament.Table.Player.profile" />
          </Button>
        </Link>
        {destructiveButton}
        <DrawerClose asChild>
          <Button size="lg" variant="outline">
            <FormattedMessage id="Common.close" />
          </Button>
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
);

export default PlayerDrawer;
