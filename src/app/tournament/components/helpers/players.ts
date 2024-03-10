import { Player } from '@/app/tournament/[id]/tournament-context';

const length = 16

export const playersArray: Player[] = Array.from({ length }, (_, i) => ({
  name: `playerWithLongName${i + 1}`,
  win: 0,
  loose: 0,
  draw: 0,
}));
