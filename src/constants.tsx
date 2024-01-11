import { signOut } from 'next-auth/react';
import { NavbarItem } from './types/next-auth';

export const navbarItems: NavbarItem[] = [
  {
    title: 'issues',
    path: '/issues',
  },
  {
    title: 'organizer',
    path: '/organizer',
  },
  {
    title: 'participant',
    path: '/participant',
  },
  
]