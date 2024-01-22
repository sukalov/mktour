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
