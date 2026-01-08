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
  notifications: {
    path: 'notifications',
    logo: Mail,
  },
  settings: {
    path: 'settings',
    logo: Settings,
  },
};

interface SubNavbarItem {
  path: string;
  logo?: LucideIcon;
  userOnly?: boolean;
  description?: string;
}
