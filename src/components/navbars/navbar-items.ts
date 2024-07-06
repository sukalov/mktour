import { TOURNAMENTS_NAVBAR_ITEMS } from '@/components/navbars/tournaments-navbar-items';

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    title: 'club',
    topTab: 'dashboard',
    path: '/club/dashboard',
    submenu: true,
    subMenuItems: [
      {
        title: 'all clubs',
        path: '/club/all',
        description: 'explore clubs and their events, join new communities',
      },
      {
        title: 'new club',
        description: 'create new chess club right here',
        path: '/club/create',
      },
    ],
  },
  {
    title: 'tournaments',
    topTab: 'my tournaments',
    path: '/tournaments/my',
    submenu: true,
    subMenuItems: TOURNAMENTS_NAVBAR_ITEMS,
  },
  {
    title: 'about us',
    path: '/info/about',
    topTab: 'about',
    submenu: true,
    subMenuItems: [
      {
        title: 'FAQ',
        path: '/info/faq',
        description: "learn how to use all mktour's cool features",
      },
      {
        title: 'contact',
        path: '/info/contact',
        description:
          'reach us with questions, ideas, hiring offers and whatever else',
      },
    ],
  },
  {
    title: 'profile',
    path: '/user/profile',
    topTab: 'myProfile',
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
