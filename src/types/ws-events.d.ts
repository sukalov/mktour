type Message =
  | { type: 'add-existing-player'; id: string }
  | { type: 'add-new-player'; body: DatabasePlayer }
  | { type: 'remove-player'; id: string } // onError add-exidsting-player
  | ErrorMessage;

type ErrorMessage = {
  type: 'error';
  data: Message;
};

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
