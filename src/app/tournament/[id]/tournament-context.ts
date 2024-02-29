import { TournamentProps } from '@/app/tournament/[id]/dashboard';
import { FC, createContext } from 'react';

export const TournamentContext = createContext<TournamentContextType>({
  tournament: {} as TournamentProps,
  tabs: [],
  currentTab: '',
  setCurrentTab: '',
  players: [],
});

export type TabType = {
  title: string;
  component: FC;
};

export type TournamentContextType = {
  tournament: TournamentProps;
  tabs: TabType[];
  currentTab: string;
  setCurrentTab: any;
  players: {
    name: string;
    win: number;
    loose: number;
    draw: number;
  }[];
};
