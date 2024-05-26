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
        title: 'explore',
        path: '/club/explore',
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
    subMenuItems: [
      {
        title: 'make tournament',
        path: '/tournaments/create',
      },
    ],
  },
  {
    title: 'about mktour_',
    path: '/about',
  },
  {
    title: 'my profile',
    path: '/user',
    userOnly: true,
  },
];
