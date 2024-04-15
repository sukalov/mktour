'use client';

import AuthButton from '@/components/auth/auth-button';
import ModeTogglerMobile from '@/components/mode-toggler-mobile';
import MktourNavbar from '@/components/ui/mktour-logo-navbar';
import { navbarItems } from '@/config/navbar-items';
import { motion, useCycle } from 'framer-motion';
import { User } from 'lucia';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode, useEffect, useRef } from 'react';
import ModeToggler from './mode-toggler';

export default function Navbar({ user, node_env }: NavbarProps) {
  if (node_env === 'production')
    console.log(
      "chess tournaments have become simple for everyone. \nexcept for devs. \nfor devs it's still hard.",
    );

  const pathname = usePathname().split('/')[1];
  const isTournament = pathname === 'tournament';
  
  // const [tournament] =
  //   useLocalStorageState<
  //     Pick<
  //       TournamentContextType,
  //       'currentRound' | 'games' | 'players' | 'tournament'
  //     >
  //   >('tournament');

  return (
    <nav className="fixed z-50 flex max-h-14 w-full min-w-max flex-row items-center justify-between border-b bg-background p-4 md:pl-4">
      <div className="flex flex-grow justify-start">
        <Link href="/">
          <MktourNavbar isTournament={isTournament} />
        </Link>
      </div>
      {/* <div className="fixed left-0 right-0 top-5 z-50 m-auto w-[300px] max-w-[50%] truncate text-center text-xs opacity-30">
        {isTournament && tournamentTitle}
      </div> */}
      <Motion pathname={pathname} user={user} />
      <AuthButton user={user} className="hidden md:block" />
      <ModeToggler className="hidden md:block" />
    </nav>
  );
}

const Motion: FC<{ pathname: string; user: User | null }> = ({
  pathname,
  user,
}) => {
  const containerRef = useRef(null);
  const router = useRouter();
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const handleSignOut = async () => {
    const response = await fetch('/api/sign-out', {
      method: 'POST',
      redirect: 'manual',
    });
    if (response.status === 0) {
      return router.refresh();
    }
  };
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      className={`fixed inset-0 z-50 block w-full md:hidden ${
        isOpen ? '' : 'pointer-events-none'
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-secondary"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16"
      >
        {navbarItems.map((item, idx) => (
          <div key={idx}>
            <MenuItem>
              <Link
                href={item.path}
                onClick={() => toggleOpen()}
                className={`flex w-full text-2xl ${
                  item.path === pathname ? 'font-bold' : ''
                }`}
              >
                {item.title}
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />
          </div>
        ))}
        <MenuItem>
          {!user ? (
            <Link className="text-xl" href="/login/lichess">
              sign in with lichess
            </Link>
          ) : (
            <button
              className="flex text-xl"
              name="log out"
              onClick={handleSignOut}
            >
              log out
            </button>
          )}
          <div className="my-3 h-px w-full bg-transparent"></div>
        </MenuItem>
        <MenuItem className="flex justify-end gap-6">
          EN {/* TODO: Button to change app language */}
          <ModeTogglerMobile />
        </MenuItem>
      </motion.ul>
      <MenuToggle toggle={toggleOpen} />
    </motion.nav>
  );
};

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
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
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

const Path = (props: any) => (
  <motion.path
    className="fill-primary stroke-primary"
    strokeWidth="2"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: 'circle(0px at 100% 0)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

type NavbarProps = {
  user: User | null;
  node_env: 'development' | 'production' | 'test';
};
