// import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      sub: ReactNode;
      id: string;
      username: string;
    };
    accessToken: string;
  }
}

export type NavbarItem = {
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
