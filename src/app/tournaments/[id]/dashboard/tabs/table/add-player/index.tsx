import AddFakerPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-fake-player';
import AddNewPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-new-player';
import AddPlayer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player/add-player';
import Fab from '@/components/fab';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Button } from '@/components/ui/button';
import SideDrawer from '@/components/ui/side-drawer';
import { InsertDatabasePlayer } from '@/server/db/schema/players';
import { ArrowLeft, Plus, UserPlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

const AddPlayerDrawer = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [addingNewPlayer, setAddingNewPlayer] = useState(false);
  const t = useTranslations('Tournament.AddPlayer');
  const [isAnimating, setIsAnimating] = useState(false);

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

  const handleChange = (state: boolean) => {
    if (!isAnimating) {
      setOpen(state);
      setAddingNewPlayer(false);
      setValue('');
    }
  };

  const returnToNewPlayer = (player: InsertDatabasePlayer) => {
    setOpen(true);
    setAddingNewPlayer(true);
    setValue(player.nickname);
  };

  useEffect(() => {
    // NB this is to disable buggy fruquent open/close state change
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);

    return () => clearTimeout(timer);
  }, [open]);

  const { data: tournamentInfo } = useTournamentInfo(tournamentId);
  if (!tournamentInfo || tournamentInfo.tournament.started_at) return null;

  return (
    <>
      <Fab
        className={`${(open || isAnimating) && 'z-60'}`}
        onClick={() => handleChange(!open)}
        icon={open ? X : UserPlus}
      />
      ;
      <SideDrawer open={open} setOpen={handleChange}>
        <div className="flex flex-col gap-3">
          <Button
            className="flex w-full gap-2"
            onClick={() => setAddingNewPlayer((prev) => !prev)}
            variant={addingNewPlayer ? 'outline' : 'default'}
          >
            {!addingNewPlayer ? <Plus /> : <ArrowLeft />}
            {!addingNewPlayer ? t('add new player') : t('back')}{' '}
          </Button>
          {
            process.env.NODE_ENV !== 'production' && (
              <AddFakerPlayer setOpen={setOpen} />
            )
            // NB DEVTOOL
          }
        </div>
        {addingNewPlayer ? (
          <AddNewPlayer
            value={value}
            setValue={setValue}
            returnToNewPlayer={returnToNewPlayer}
            handleClose={() => handleChange(false)}
          />
        ) : (
          <AddPlayer
            value={value}
            setValue={setValue}
            handleClose={() => handleChange(false)}
          />
        )}
      </SideDrawer>
    </>
  );
};

export type DrawerProps = {
  value: string;
  handleClose: () => void;
  setValue: Dispatch<SetStateAction<string>>;
};

export default AddPlayerDrawer;
