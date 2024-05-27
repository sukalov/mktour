'use client'

import { SubNavbarItem } from "@/components/navbars/subnavbar";
import { Flag, Home, Mail, Settings, Users } from "lucide-react";

export const clubDashboardNavbarItems: SubNavbarItem[] = [
  {
    title: 'main',
    path: '',
    logo: Home
  },
  {
    title: 'players',
    path: 'players',
    logo: Users
  },
  {
    title: 'tournaments',
    path: 'tournaments',
    logo: Flag
  },
  {
    title: 'settings',
    path: 'settings',
    logo: Settings
  },
  {
    title: 'inbox',
    path: 'inbox',
    logo: Mail
  }
];
