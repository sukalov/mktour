import { FC, PropsWithChildren } from 'react';

const Overlay: FC<{ open: boolean } & PropsWithChildren> = ({
  open,
  children,
}) => {
  return (
    <div
      className={`pointer-events-none fixed bottom-0 top-0 z-50 h-full w-full ${open ? 'opacity-100' : 'opacity-0'} backdrop-blur-[1px] backdrop-brightness-50 transition-opacity delay-75 duration-300`}
    >
      {children}
    </div>
  );
};

export default Overlay;
