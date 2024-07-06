import { setUserLocale } from '@/components/get-user-locale';
import ModeTogglerMobile from '@/components/navbars/mode-toggler-mobile';
import { NAVMENU_ITEMS } from '@/components/navbars/nav-menu-items';
import MenuItem from '@/components/navbars/nav-menu/menu-item';
import MenuItemWithSubMenu from '@/components/navbars/nav-menu/menu-item-with-sub';
import MenuToggle from '@/components/navbars/nav-menu/menu-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, useCycle } from 'framer-motion';
import { User } from 'lucia';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useRef } from 'react';

const Content: FC<{ pathname: string; user: User | null }> = ({
  pathname,
  user,
}) => {
  const containerRef = useRef(null);
  const router = useRouter();
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const locale = useLocale();
  const handleClickLocale = async () => {
    setUserLocale(locale === 'en' ? 'ru' : 'en');
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

  const t = useTranslations('Menu');

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
          {NAVMENU_ITEMS.map((item, idx) => (
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
                    {t(item.title)}
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
                {t('logout')}
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

export const selected =
  'py-1 px-3 -ml-0 bg-primary text-primary-foreground w-fit rounded-sm';

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

export default Content;
