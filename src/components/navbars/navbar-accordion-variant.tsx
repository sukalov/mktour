'use client';

import AuthButton from '@/components/auth/auth-button';
import { LocaleContext } from '@/components/locale-context';
import ModeToggler from '@/components/navbars/mode-toggler';
import ModeTogglerMobile from '@/components/navbars/mode-toggler-mobile';
import { NAVBAR_ITEMS } from '@/components/navbars/navbar-items';
import { Button } from '@/components/ui/button';
import MktourNavbar from '@/components/ui/mktour-logo-navbar';
import { motion, useCycle } from 'framer-motion';
import { User } from 'lucia';
import { ChevronDown } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export default function Navbar({ user, node_env }: NavbarProps) {
  const pathname = usePathname().split('/')[1];
  const isTournament = pathname === 'tournament';

  // const [tournament] =
  //   useLocalStorageState<
  //     Pick<
  //       DashboardContextType,
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
  const { locale, setLocale } = useContext(LocaleContext);
  const handleClickLocale = () => {
    setLocale(locale === 'en' ? 'ru' : 'en');
  };
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
        {NAVBAR_ITEMS.map((item, idx) => (
          <div key={idx}>
            {!item.submenu ? (
              <MenuItem key={idx}>
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
            ) : (
              <MenuItemWithSubMenu toggleOpen={toggleOpen} item={item} />
            )}
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
              <FormattedMessage id="menu.logout" />
            </button>
          )}
          <div className="my-3 h-px w-full bg-transparent"></div>
        </MenuItem>
        <MenuItem className="flex justify-end gap-6">
          <Button variant={'ghost'} size={'icon'} onClick={handleClickLocale}>
            {locale.toUpperCase()}
          </Button>
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

const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
  item,
  toggleOpen,
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem>
        <button
          className="flex w-full text-2xl"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <span
              className={`${pathname.includes(item.path) ? 'font-bold' : ''}`}
            >
              {item.title}
            </span>
            <div className={`${subMenuOpen && 'rotate-180'}`}>
              <ChevronDown width="24" height="24" />
            </div>
          </div>
        </button>
      </MenuItem>
      <div className="ml-2 mt-2 flex flex-col space-y-2">
        {subMenuOpen && (
          <>
            {item.subMenuItems.map((subItem: NavbarItem, subIdx: number) => {
              return (
                <MenuItem key={subIdx}>
                  <Link
                    href={subItem.path}
                    onClick={() => toggleOpen()}
                    className={` ${
                      subItem.path === pathname ? 'font-bold' : ''
                    }`}
                  >
                    {subItem.title}
                  </Link>
                </MenuItem>
              );
            })}
          </>
        )}
      </div>
    </>
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
