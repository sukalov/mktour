'use client';

import ClubInbox from '@/app/clubs/my/(tabs)/inbox';
import ClubMain from '@/app/clubs/my/(tabs)/main';
import ClubPlayersList from '@/app/clubs/my/(tabs)/players';
import ClubSettings from '@/app/clubs/my/(tabs)/settings';
import ClubDashboardTournaments from '@/app/clubs/my/(tabs)/tournaments';
import { FC } from 'react';

export const tabMap: Record<ClubDashboardTab, FC<ClubTabProps>> = {
  main: ClubMain,
  players: ClubPlayersList,
  tournaments: ClubDashboardTournaments,
  inbox: ClubInbox,
  settings: ClubSettings,
};

export type ClubDashboardTab =
  | 'main'
  | 'players'
  | 'tournaments'
  | 'inbox'
  | 'settings';

export type ClubTabProps = {
  selectedClub: string;
  userId: string;
  isInView?: boolean;
};
