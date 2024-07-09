'use client';

import { SubNavbarItem } from '@/components/navigation/subnavbar';
import { Flag, Home, Mail, Settings, Users } from 'lucide-react';

export const CLUB_DASHBOARD_NAVBAR_ITEMS: SubNavbarItem[] = [
  {
    title: 'main',
    path: '',
    logo: Home,
  },
  {
    title: 'players',
    path: 'players',
    logo: Users,
  },
  {
    title: 'tournaments',
    path: 'tournaments',
    logo: Flag,
  },
  {
    title: 'inbox',
    path: 'inbox',
    logo: Mail,
  },
  {
    title: 'settings',
    path: 'settings',
    logo: Settings,
  },
];
