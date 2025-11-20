'use client';

import ClubInbox from '@/app/clubs/my/(tabs)/inbox';
import ClubMain from '@/app/clubs/my/(tabs)/main';
import ClubSettings from '@/app/clubs/my/(tabs)/settings';
import ClubPlayersList from '@/app/clubs/players';
import ClubDashboardTournaments from '@/app/clubs/tournaments';
import { StatusInClub } from '@/server/db/zod/enums';
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
  statusInClub?: StatusInClub;
  isInView?: boolean;
};
