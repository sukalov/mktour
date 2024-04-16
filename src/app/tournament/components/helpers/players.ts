import { DashboardContextType } from '@/app/tournament/[id]/dashboard-context';

const length = 16;

export const playersArray: DashboardContextType['players'] = Array.from(
  { length },
  (_, i) => ({
    player_id: `${i + 100}`,
    tournament_id: `${i + 111}`, //FIXME get from tournament!
    wins: 0,
    losses: 0,
    draws: 0,
    color_index: 0,
    place: null,
    nickname: `playerWithLongName${i + 1}`,
  }),
);
