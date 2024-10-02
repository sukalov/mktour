import { FC } from 'react';

const Overlay: FC<{ open: boolean }> = ({ open }) => (
  <div
    className={`pointer-events-none absolute bottom-0 top-0 z-50 h-full w-full ${open ? 'opacity-100' : 'opacity-0'} backdrop-blur-[1px] backdrop-brightness-50 transition-opacity delay-75 duration-300`}
  />
);

export default Overlay;
