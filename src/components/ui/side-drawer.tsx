import { FC, PropsWithChildren } from 'react';
import { Drawer } from 'vaul';

type DrawerProps = PropsWithChildren & {
  open: boolean;
  setOpen: (arg: boolean) => void;
};

const SideDrawer: FC<DrawerProps> = ({ open, setOpen, children }) => {
  return (
    <Drawer.Root
      direction="right"
      noBodyStyles
      onOpenChange={(state) => setOpen(state)}
      open={open}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 top-0 z-50 bg-black/80" />
        <Drawer.Content
          onInteractOutside={() => setOpen(false)}
          className="fixed top-0 right-0 bottom-0 left-[5rem] z-50 flex flex-col outline-hidden"
        >
          <Drawer.Title />
          <Drawer.Description />
          <div className="border-secondary bg-background flex h-[100dvh] flex-1 flex-col gap-3 rounded-l-[15px] border p-4">
            <div className="w-full">{children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default SideDrawer;
