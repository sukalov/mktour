import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

const Overlay: FC<{ open: boolean }> = ({ open }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed z-20 h-full w-full border bg-black/25 backdrop-blur-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        exit={{ opacity: 0 }}
      />
    )}
  </AnimatePresence>
);

export default Overlay;
