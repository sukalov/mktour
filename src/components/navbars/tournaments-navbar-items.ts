import { SubNavbarItem } from '@/components/navbars/subnavbar';

export const tournamentsNavbarItems: SubNavbarItem[] = [
  {
    title: 'all tournaments',
    path: '/tournaments/all',
  },
  {
    title: 'my tournaments',
    path: '/tournaments/my',
    userOnly: true,
  },
  {
    title: 'make tournament',
    path: '/tournaments/create',
  },
];
