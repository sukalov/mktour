import { tournamentsNavbarItems } from '@/components/navbars/tournaments-navbar-items';

export const navbarItems: NavbarItem[] = [
  {
    title: 'club',
    path: '/club',
    submenu: true,
    subMenuItems: [
      {
        title: 'dashboard',
        path: '/club/dashboard',
      },
      {
        title: 'all clubs',
        path: '/club/all',
      },
      {
        title: 'new club',
        path: '/club/create',
      },
    ],
  },
  {
    title: 'tournaments',
    path: '/tournaments',
    submenu: true,
    subMenuItems: tournamentsNavbarItems,
  },
  {
    title: 'about us',
    path: '/about',
    submenu: true,
    subMenuItems: [
      {
        title: 'FAQ',
        path: '/about/faq',
      },
    ],
  },
  {
    title: 'profile',
    path: '/user',
    userOnly: true,
  },
];
