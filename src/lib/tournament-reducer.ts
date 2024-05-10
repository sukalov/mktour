import { TournamentModel } from '@/types/tournaments';

export const initialState = {};

type Action = {
  type: 'player-added';
  [arg: string]: any;
};

export const tournamentReducer = (
  tournament: TournamentModel,
  action: Action,
) => {
  switch (action.type) {
    case 'player-added': {
      tournament.players.push(action.player)
      return tournament
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};
