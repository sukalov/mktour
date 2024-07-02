type NavbarItem = {
  title: string;
  path: string;
  description?: string;
  userOnly?: boolean;
  submenu?: boolean;
  topTab?: string;
  subMenuItems?: SideNavItem[];
};

type MenuItemWithSubMenuProps = {
  item: SideNavItem;
  toggleOpen: () => void;
};

type ValidModernISODate = `${`20`}${number}${number}-${`${0 | 1}${number}`}-${
  | 0
  | 1
  | 2
  | 3}${number}`;
