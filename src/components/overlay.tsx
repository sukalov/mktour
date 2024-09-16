import { FC, PropsWithChildren } from 'react';

const Overlay: FC<{ open: boolean } & PropsWithChildren> = ({
  open,
  children,
}) => {
  return (
    <div
      className={`fixed bottom-0 top-0 z-50 h-full w-full ${open ? 'block' : 'hidden'} backdrop-brightness-50 backdrop-blur-[1px] transition-all`}
    >
      {children}
    </div>
  );
};

export default Overlay;
