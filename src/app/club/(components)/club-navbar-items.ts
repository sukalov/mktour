export const clubsNavbarItems: ClubsNavbarItem[] = [
  {
    title: 'dashboard',
    slug: ''
  },
  {
    title: 'settings',
    slug: 'settings',
  },
  {
    title: 'new club',
    slug: 'create',
  },
];

export interface ClubsNavbarItem {
  title: string;
  slug: string;
  description?: string;
}
