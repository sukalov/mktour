import { MotionProps, motion } from 'framer-motion';

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute right-4 top-[18px] z-30 stroke-none text-foreground"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 9.423 L 20 9.423', opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
    <span className="sr-only">navigation menu</span>
  </button>
);

const Path = (props: MotionProps) => (
  <motion.path
    className="fill-primary stroke-primary"
    strokeWidth="2"
    strokeLinecap="round"
    {...props}
  />
);

export default MenuToggle;
