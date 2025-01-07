import Fab from '@/app/tournaments/[id]/dashboard/fab';
import AddFakerPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-fake-player';
import AddNewPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-new-player';
import AddPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-player';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Button } from '@/components/ui/button';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { delay } from 'framer-motion';
import { ArrowLeft, Plus, UserPlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Drawer } from 'vaul';

const AddPlayerDrawer = () => {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [elevated, setElevated] = useState<boolean>(false);
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);
  const t = useTranslations('Tournament.AddPlayer');

  useHotkeys(
    'shift+equal',
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true },
  );
  useHotkeys(
    'control+shift+equal',
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
      setAddingNewPlayer(true);
    },
    { enableOnFormTags: true },
  );

  const handleFabClick = () => {
    setOpen(!open);
    !elevated && setElevated(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAddingNewPlayer(false);
    setValue('');
  };

  const returnToNewPlayer = (player: DatabasePlayer) => {
    setOpen(true);
    setAddingNewPlayer(true);
    setValue(player.nickname);
  };

  useEffect(() => {
    !open && delay(() => setElevated(open), 500);
  }, [open]);

  const { data: tournamentInfo } = useTournamentInfo(tournamentId);
  if (!tournamentInfo || tournamentInfo.tournament.started_at) return null;
  return (
    <Drawer.Root
      direction="right"
      noBodyStyles
      onClose={handleClose}
      open={open}
    >
      <Fab
        className={`${elevated && 'z-60'}`}
        onClick={handleFabClick}
        icon={open ? X : UserPlus}
      />
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 top-0 z-50 bg-black/80" />
        <Drawer.Content
          onInteractOutside={handleClose}
          className="fixed top-0 right-0 bottom-0 left-[5rem] z-50 flex flex-col outline-hidden"
        >
          <Drawer.Title />
          <Drawer.Description />
          <div className="border-secondary bg-background flex h-[100dvh] flex-1 flex-col gap-3 rounded-l-[15px] border p-4">
            <div className="flex flex-col gap-3">
              <Button
                className="flex w-full gap-2"
                onClick={() => setAddingNewPlayer((prev) => !prev)}
                variant={addingNewPlayer ? 'outline' : 'default'}
              >
                {!addingNewPlayer ? <Plus /> : <ArrowLeft />}
                {!addingNewPlayer ? t('add new player') : t('back')}{' '}
              </Button>
              <AddFakerPlayer setOpen={setOpen} />
            </div>
            <div className="w-full">
              {addingNewPlayer ? (
                <AddNewPlayer
                  value={value}
                  setValue={setValue}
                  returnToNewPlayer={returnToNewPlayer}
                  handleClose={handleClose}
                />
              ) : (
                <AddPlayer
                  value={value}
                  setValue={setValue}
                  handleClose={handleClose}
                />
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export type DrawerProps = {
  value: string;
  handleClose: () => void;
  setValue: Dispatch<SetStateAction<string>>;
};

export default AddPlayerDrawer;
