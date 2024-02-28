
import { TournamentProps } from '@/app/tournament/[id]/dashboard';
import { createContext } from 'react';

export const TournamentContext = createContext<TournamentContextType>({
  tournament: {} as TournamentProps,
  tabs: [],
  currentTab: '',
  setCurrentTab: '',
  players: [],
});

type TournamentContextType = {
  tournament: TournamentProps;
  tabs: string[];
  currentTab: string;
  setCurrentTab: any;
  players: {
    name: string;
    win: number;
    loose: number;
    draw: number;
  }[];
};
