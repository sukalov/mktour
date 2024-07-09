import { SubNavbarItem } from '@/components/navigation/subnavbar';

export const TOURNAMENTS_NAVBAR_ITEMS: SubNavbarItem[] = [
  {
    title: 'all tournaments',
    path: '/tournaments/all',
    userOnly: true,
  },
  {
    title: 'make tournament',
    path: '/tournaments/create',
  },
];
