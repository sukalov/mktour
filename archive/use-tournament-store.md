```typescript
export interface TournamentStore extends TournamentModel {
  isLoading: boolean;
  initAsync: (_id: string) => void;
  init: (_state: TournamentModel) => void;
  possiblePlayers: Array<DatabasePlayerSlice>;
  initPossiblePlayers: (_players: Array<DatabasePlayerSlice>) => void;
  addNewPlayer: (_player: DatabasePlayerSlice) => void;
  addPlayer: (_id: string) => void;
  removePlayer: (_id: string) => void;
  removeNewPlayer: (_id: string) => void;
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
    set(() => ({ possiblePlayers: players }));
  },
  init: (state) => {
    set({ ...state, isLoading: false });
  },
  addNewPlayer: (player) => {
    set((state) => {
      const newPlayer: PlayerModel = {
        wins: 0,
        draws: 0,
        losses: 0,
        color_index: 0,
        ...player,
      };
      return {
        players: state.players.concat(newPlayer),
      };
    });
  },
  addPlayer: (id) => {
    set((state) => {
      const player = state.possiblePlayers.find((el) => el.id === id);
      if (!player) return {};
      const newPlayer: PlayerModel = {
        id: player.id,
        nickname: player.nickname,
        rating: player.rating,
        wins: 0,
        draws: 0,
        losses: 0,
        color_index: 0,
      };
      return {
        players: [...state.players, newPlayer],
        possiblePlayers: state.possiblePlayers.filter(
          (someone) => someone.id !== id,
        ),
      };
    });
  },
  removePlayer: (id) => {
    set((state) => {
      const player = state.players.find((el) => el.id === id);
      if (!player) return {};
      const newPlayer = {
        id: player.id,
        nickname: player.nickname,
        realname: player.realname,
        rating: player.rating,
      };
      return {
        players: state.players.filter((someone) => someone.id !== id),
        possiblePlayers: state.possiblePlayers.concat(newPlayer),
      };
    });
  },
  removeNewPlayer: (id) =>
    set((state) => ({
      players: state.players.filter((someone) => someone.id !== id),
    })),
}));

export interface DatabasePlayerSlice {
  id: string;
  nickname: string;
  rating?: number | null;
  realname?: string | null;
  [key: string]: any;
}
```
