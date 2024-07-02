import { TOURNAMENTS_NAVBAR_ITEMS } from '@/components/navbars/tournaments-navbar-items';

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    title: 'club',
    topTab: 'dashboard',
    description:
      'it is your chess club dashboard. here you can manage your players, events and other club settings',
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
    description:
      'here are all the tournaments related to you. both, where you played and which were organixed by your club(s)',
    path: '/tournaments/my',
    submenu: true,
    subMenuItems: TOURNAMENTS_NAVBAR_ITEMS,
  },
  {
    title: 'about us',
    path: '/info/about',
    description:
      'mktour is an open-source project. here you can learn more about the team and the app',
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
