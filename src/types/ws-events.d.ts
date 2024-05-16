
type Message = 
  | {type: 'add-existing-player', id: string}
  | {type: 'add-new-player', body: DatabasePlayer}
  | {type: 'remove-player', id: string}

interface PlayerModel {
  id: string;
  nickname: string;
  realname?: string | null;
  rating?: number | null;
  wins: number;
  draws: number;
  losses: number;
  color_index: number;
}
