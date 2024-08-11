
export const NAVMENU_ITEMS: NavbarItem[] = [
  {
    title: 'club',
    topTab: 'dashboard',
    path: '/club/dashboard',
    subMenuItems: [
      {
        title: 'all clubs',
        path: '/club/all',
        description: true,
      },
      {
        title: 'new club',
        path: '/club/create',
        description: true,
      },
    ],
  },
  {
    title: 'tournaments',
    topTab: 'my tournaments',
    path: '/tournaments/my',
    subMenuItems: [
      {
        title: 'all tournaments',
        path: '/tournaments/all',
        userOnly: true,
        description: true,
      },
      {
        title: 'make tournament',
        path: '/tournaments/create',
        description: true,
      },
    ],
  },
  {
    title: 'about us',
    path: '/info/about',
    topTab: 'about',
    subMenuItems: [
      {
        title: 'FAQ',
        path: '/info/faq',
        description: true,
      },
      {
        title: 'contact',
        path: '/info/contact',
        description: true,
      },
    ],
  },
  // {
  //   title: 'profile',
  //   path: '/user',
  //   topTab: 'myProfile',
  //   userOnly: true,
  //   subMenuItems: [
  //     {
  //       title: 'find people',
  //       path: '/user/search',
  //     },
  //     {
  //       title: 'edit profile',
  //       path: '/user/edit',
  //     },
  //   ],
  // },
];
