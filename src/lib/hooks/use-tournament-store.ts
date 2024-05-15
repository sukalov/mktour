import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { getTournamentState } from '@/lib/get-tournament-state';
import { PlayerModel, TournamentModel } from '@/types/tournaments';

import { create } from 'zustand';

export interface TournamentStore extends TournamentModel {
  isLoading: boolean;
  addPlayer: (player: DatabasePlayer) => void;
  initAsync: (id: string) => void;
  init: (state: TournamentModel) => void;
  possiblePlayers: Array<DatabasePlayer>;
  initPossiblePlayers: (players: Array<DatabasePlayer>) => void;
  removePossiblePlayer: (player: DatabasePlayer) => void;
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  id: '',
  date: '',
  title: '',
  type: undefined,
  format: undefined,
  organizer: {
    id: '',
    name: '',
  },
  status: undefined,
  roundsNumber: null,
  players: [],
  games: [],
  ongoingRound: 1,
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
  addPlayer: (player) => {
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
  removePossiblePlayer: (player) => {
    set((state) => ({
      possiblePlayers: state.possiblePlayers.filter(
        (someone) => someone.id !== player.id,
      ),
    }));
  },
}));

export const addPlayer = (player: DatabasePlayer) =>
  useTournamentStore.setState((state) => {
    state.addPlayer(player);
    return state;
  });
