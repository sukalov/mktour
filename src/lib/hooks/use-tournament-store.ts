import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { getTournamentState } from '@/lib/get-tournament-state';
import { PlayerModel, TournamentModel } from '@/types/tournaments';

import { create } from 'zustand';

interface TournamentStore extends TournamentModel {
  isLoading: boolean;
  addNewPlayer: (player: DatabasePlayer) => void;
  initAsync: (id: string) => void;
  init: (state: TournamentModel) => void;
  possiblePlayers: Array<DatabasePlayer>;
  initPossiblePlayers: (players: Array<DatabasePlayer>) => void;
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  id: '',
  date: '',
  title: '',
  type: undefined,
  format: undefined,
  organizer: '',
  organizerId: '',
  status: undefined,
  roundsNumber: null,
  players: [],
  games: [],
  possiblePlayers: [],
  isLoading: true,
  initAsync: async (id) => {
    const initialState = await getTournamentState(id);
    set({ ...initialState, isLoading: false });
  },
  initPossiblePlayers: (players) => {
    set((state) => ({ possiblePlayers: players }));
  },
  init: (state) => {
    set({ ...state, isLoading: false });
  },
  addNewPlayer: (player) => {
    const newPlayer: PlayerModel = {
      id: player.id,
      nickname: player.nickname,
      rating: player.rating,
      wins: 0,
      draws: 0,
      losses: 0,
      color_index: 0,
    };
    set((state) => ({ players: [...state.players, newPlayer] }));
  },
}));

export const addNewPlayer = (player: DatabasePlayer) =>
  useTournamentStore.setState((state) => {
    state.addNewPlayer(player);
    return state;
  });
