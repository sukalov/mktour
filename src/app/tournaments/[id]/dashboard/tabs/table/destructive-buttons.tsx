import FormattedMessage from '@/components/formatted-message';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { PlayerModel } from '@/types/tournaments';
import { LogOut, Trash2 } from 'lucide-react';
import { FC } from 'react';

export const DeleteButton: FC<{ handleDelete: () => void }> = ({
  handleDelete,
}) => (
  <Button
    className="flex gap-2"
    size="lg"
    variant="destructive"
    onClick={handleDelete}
  >
    <Trash2 />
    <FormattedMessage id="Tournament.Table.Player.delete" />
  </Button>
);

export const WithdrawButtonWithConfirmation: FC<{
  selectedPlayer: PlayerModel | null;
}> = ({ selectedPlayer }) => (
  <>
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex gap-2" size="lg" variant="outline">
          <LogOut />
          <FormattedMessage id="Tournament.Table.Player.Withdraw.withdraw" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <FormattedMessage id="Tournament.Main.confirmation header" />
          </DrawerTitle>
          <DrawerDescription>
            <FormattedMessage id="Tournament.Table.Player.Withdraw.description" />
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex w-full flex-col gap-4 p-4 pt-0">
          <Button
            className="flex w-full gap-2"
            size="lg"
            onClick={console.log} // FIXME handle Withdraw from tournament
            variant="destructive"
          >
            <LogOut />
            <FormattedMessage
              id="Tournament.Table.Player.Withdraw.confirm"
              values={{ nickname: selectedPlayer?.nickname }}
            />
          </Button>
          <DrawerClose asChild>
            <Button size="lg" className="w-full" variant="outline">
              <FormattedMessage id="Common.close" />
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  </>
);
