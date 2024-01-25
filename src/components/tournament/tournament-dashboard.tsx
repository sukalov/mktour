'use client';

import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { Tournament } from '@/lib/tournaments/models';
import { useEffectOnce } from 'usehooks-ts'


type TournamentDashboardProps = {
  data: NewTournamentForm;
};

declare global {
  interface Window {
    tournament: typeof Tournament;
  }
}

export default function TournamentDashboard({
  data,
}: TournamentDashboardProps) {
  useEffectOnce(() => {
    window.tournament = Tournament;
  })
  return <></>;
}
