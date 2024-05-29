import { TOURNAMENTS_NAVBAR_ITEMS } from '@/components/navbars/tournaments-navbar-items';

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    title: 'club',
    path: '/club/dashboard',
    submenu: true,
    subMenuItems: [
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
    path: '/tournaments/my',
    submenu: true,
    subMenuItems: TOURNAMENTS_NAVBAR_ITEMS,
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
      {
        title: 'contact',
        path: '/about/contact',
      },
    ],
  },
  {
    title: ' my profile',
    path: '/user',
    userOnly: true,
    submenu: true,
    subMenuItems: [
      {
        title: 'find people',
        path: '/user/search',
      },
      {
        title: 'edit profile',
        path: '/user/edit',
      },
    ],
  },
];
