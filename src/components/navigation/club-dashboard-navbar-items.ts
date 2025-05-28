'use client';

import { Flag, Home, LucideIcon, Mail, Settings, Users } from 'lucide-react';

export const CLUB_DASHBOARD_NAVBAR_ITEMS: Record<string, SubNavbarItem> = {
  main: {
    path: '',
    logo: Home,
  },
  players: {
    path: 'players',
    logo: Users,
  },
  tournaments: {
    path: 'tournaments',
    logo: Flag,
  },
  inbox: {
    path: 'inbox',
    logo: Mail,
  },
  settings: {
    path: 'settings',
    logo: Settings,
  },
};

export type SubNavbarItem = {
  path: string;
  logo?: LucideIcon;
  userOnly?: boolean;
  description?: string;
};
