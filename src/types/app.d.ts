type NavbarItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
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
