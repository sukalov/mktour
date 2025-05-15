import AddManager from '@/app/clubs/my/(tabs)/settings/add-manager';
import Fab from '@/app/tournaments/[id]/dashboard/fab';
import { useDebounce } from '@/components/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, UserPlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Drawer } from 'vaul';

const AddManagerDrawer = ({
  clubId,
  userId,
}: {
  clubId: string;
  userId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);
  const t = useTranslations('Club.Settings');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = (state: boolean) => {
    if (!isAnimating) {
      setOpen(state);
      setValue('');
    }
  };

  useEffect(() => {
    // NB this is to disable buggy fruquent open/close state change
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);

    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Drawer.Root
      direction="right"
      noBodyStyles
      onOpenChange={(state) => handleChange(state)}
      open={open}
    >
      <Button
        size="icon"
        variant="outline"
        onClick={() => handleChange(true)}
        className="flex w-full gap-2"
      >
        <UserPlus />
        {t('add manager')}
      </Button>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 top-0 z-50 bg-black/80" />
        <Drawer.Content
          onInteractOutside={() => handleChange(false)}
          className="fixed top-0 right-0 bottom-0 left-[5rem] z-50 flex flex-col outline-hidden"
        >
          <Drawer.Title />
          <Drawer.Description />
          <div className="border-secondary bg-background flex h-[100dvh] flex-1 flex-col gap-3 rounded-l-[15px] border p-4">
            <div className="flex flex-col gap-3"></div>
            <div className="w-full">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center justify-center gap-3">
                  <SearchIcon />
                  <Input
                    className="drop-shadow-md"
                    id="user-search"
                    placeholder={t('search')}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                <AddManager
                  debouncedValue={debouncedValue}
                  setValue={setValue}
                  handleClose={() => handleChange(false)}
                  clubId={clubId}
                  userId={userId}
                />
              </div>
              <Fab
                className={`${(open || isAnimating) && 'z-60'} ${!open && 'hidden'}`}
                onClick={() => handleChange(false)}
                icon={X}
              />
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

export default AddManagerDrawer;
