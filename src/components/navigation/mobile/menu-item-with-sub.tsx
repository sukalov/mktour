import { selected } from '@/components/navigation/mobile/menu';
import MenuItem from '@/components/navigation/mobile/menu-item';
import { NavbarItem } from '@/components/navigation/nav-menu-items';
import { cn } from '@/lib/utils';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
  item,
  toggleOpen,
}) => {
  const pathname = usePathname();
  const t = useTranslations('Menu');

  return (
    <>
      <MenuItem>
        <Link
          className={`flex text-2xl ${cn(pathname.startsWith(item.path) ? selected : 'ml-3')}`}
          onClick={() => toggleOpen()}
          href={item.path}
        >
          <div className="flex w-full flex-row items-center justify-between">
            {t(item.title)}
          </div>
        </Link>
      </MenuItem>
      <div className="ml-6 mt-2 flex flex-col space-y-2">
        {item.subMenuItems?.map((subItem, subIdx: number) => {
          return (
            <MenuItem key={subIdx}>
              <Link
                href={subItem.path}
                onClick={() => toggleOpen()}
                className={` ${pathname.includes(subItem.path) ? selected : 'ml-3'}`}
              >
                {t(`Subs.${subItem.title}`)}
              </Link>
            </MenuItem>
          );
        })}
      </div>
    </>
  );
};

type MenuItemWithSubMenuProps = {
  item: NavbarItem;
  toggleOpen: () => void;
};

export default MenuItemWithSubMenu;
