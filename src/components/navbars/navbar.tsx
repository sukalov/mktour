'use client';

import AuthButton from '@/components/auth/auth-button';
import { LocaleContext } from '@/components/locale-context';
import ModeToggler from '@/components/navbars/mode-toggler';
import ModeTogglerMobile from '@/components/navbars/mode-toggler-mobile';
import { NAVBAR_ITEMS } from '@/components/navbars/navbar-items';
import MktourNavbar from '@/components/ui/mktour-logo-navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MotionProps, motion, useCycle } from 'framer-motion';
import { User } from 'lucia';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

const selected =
  'py-1 px-3 -ml-0 bg-primary text-primary-foreground w-fit rounded-sm';

export default function Navbar({ user, node_env }: NavbarProps) {
  const pathname = usePathname().split('/')[1];
  const isTournament = pathname === 'tournament';

  return (
    <nav className="fixed z-[1000000000] flex max-h-14 w-full min-w-max flex-row items-center justify-between border-b bg-background p-4 md:pl-4">
      <div className="flex flex-grow justify-start">
        <Link href="/">
          <MktourNavbar isTournament={isTournament} />
        </Link>
      </div>
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
    toggleOpen();
    const response = await fetch('/api/sign-out', {
      method: 'POST',
      redirect: 'manual',
    });
    if (response.status === 0) {
      return router.refresh();
    }
  };

  const variants = useMemo(
    () => ({
      open: {
        transition: { staggerChildren: 0.02, delayChildren: 0.15 },
      },
      closed: {
        transition: { staggerChildren: 0.01, staggerDirection: -1 },
      },
    }),
    [],
  );

  const sidebar = useMemo(
    () => ({
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
    }),
    [],
  );

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      className={`fixed inset-0 block w-full md:hidden ${
        isOpen ? '' : 'pointer-events-none'
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-secondary"
        variants={sidebar}
      />
      <motion.ul variants={variants}>
        <ScrollArea
          className="offset-4 grid h-[92svh] w-full gap-2 px-8 pb-4 pt-8"
          type="auto"
          noScrollbar
        >
          {NAVBAR_ITEMS.map((item, idx) => (
            <div key={idx}>
              {!item.submenu ? (
                <MenuItem key={idx}>
                  <Link
                    href={item.path}
                    onClick={() => toggleOpen()}
                    className={`text-2xl ${
                      pathname.includes(item.path.replaceAll('/', ''))
                        ? selected
                        : ''
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
              <Link
                className="ml-2 text-2xl"
                href="/login/lichess"
                onClick={() => toggleOpen()}
              >
                sign in with lichess
              </Link>
            ) : (
              <button
                className="ml-2 flex text-2xl"
                name="log out"
                onClick={handleSignOut}
              >
                <FormattedMessage id="menu.logout" />
              </button>
            )}
            <div className="my-3 h-px w-full bg-transparent"></div>
          </MenuItem>
        </ScrollArea>
        <MenuItem className="absolute bottom-4 grid w-full grid-flow-col-dense px-[30%] text-center child:flex child:flex-auto child:items-center child:justify-center">
          <button className="z-30 w-full" onClick={handleClickLocale}>
            {locale.toUpperCase()}
          </button>
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

  return (
    <>
      <MenuItem>
        <Link
          className={`flex text-2xl ${pathname.startsWith(item.path) ? selected : 'ml-3'}`}
          onClick={() => toggleOpen()}
          href={item.path}
        >
          <div className="flex w-full flex-row items-center justify-between">
            {item.title}
          </div>
        </Link>
      </MenuItem>
      <div className="ml-6 mt-2 flex flex-col space-y-2">
        {item.subMenuItems.map((subItem: NavbarItem, subIdx: number) => {
          return (
            <MenuItem key={subIdx}>
              <Link
                href={subItem.path}
                onClick={() => toggleOpen()}
                className={` ${pathname.includes(subItem.path) ? selected : 'ml-3'}`}
              >
                {subItem.title}
              </Link>
            </MenuItem>
          );
        })}
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

type NavbarProps = {
  user: User | null;
  node_env: 'development' | 'production' | 'test';
};
