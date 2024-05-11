import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { getTournamentState } from '@/lib/get-tournament-state';
import { PlayerModel, TournamentModel } from '@/types/tournaments';

import { create } from 'zustand';

// export class TournamentStore implements TournamentModel {
//   public id: string = '';
//   public date: string = '';
//   public title: string = '';
//   public type: TournamentType | undefined = undefined; // Assuming TournamentType is defined elsewhere
//   public format: Format | undefined = undefined; // Assuming Format is defined elsewhere
//   public organizer: string = '';
//   public organizer_id: string = '';
//   public status: TournamentStatus | undefined = undefined; // Assuming TournamentStatus is defined elsewhere
//   public rounds_number: number | null = null;
//   public players: Array<PlayerModel> = [];
//   public games: Array<GameModel> = [];

//   constructor(id: string) {
//     this.loadTournament(id);
//   }

//   async loadTournament(id: string) {
//     let tournament = await getTournamentState(id);
//     this.id = id;
//     this.date = tournament.date;
//     this.title = tournament.title;
//     this.type = tournament.type;
//     this.format = tournament.format;
//     this.organizer = tournament.organizer;
//     this.organizer_id = tournament.organizer_id;
//     this.status = tournament.status;
//     this.rounds_number = tournament.rounds_number;
//     this.players = tournament.players;
//     this.games = tournament.games;
//     this.isLoading = false;
//   }

//   isLoading = this.organizer_id === '';
// }

interface TournamentStore extends TournamentModel {
  isLoading: boolean;
  addPlayer: (player: DatabasePlayer) => void;
  init: (id: string) => void;
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
  isLoading: true,
  init: async (id) => {
    const initialState = await getTournamentState(id)
    set({...initialState, isLoading: false})
  },
  addPlayer: (player) => {
    const newPlayer: PlayerModel = {
      nickname: player.nickname,
      id: player.id,
      wins: 0,
      draws: 0,
      losses: 0,
      color_index: 0
    }
    set(state => ({ players: [...state.players, newPlayer] }))},
}));

export const addPlayer = (player: DatabasePlayer) => useTournamentStore.setState(state => {
  state.addPlayer(player)
  return state
})