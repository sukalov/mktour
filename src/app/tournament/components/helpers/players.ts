import { Player } from '@/app/tournament/[id]/tournament-context';

export const playersArray: Player[] = Array.from({ length: 8 }, (_, i) => ({
  name: `player${i + 1}`,
  win: 0,
  loose: 0,
  draw: 0,
}));
