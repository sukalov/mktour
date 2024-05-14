import { DatabasePlayer } from '@/lib/db/schema/tournaments';

interface Message {
  type: MessageType;
  body: DatabasePlayer;
}

type MessageType = 'add-existing-player' | 'add-new-player';

interface PlayerModel {
  id: string;
  nickname: string;
  fullname?: string | null;
  rating?: number | null;
  club_id: string;
  wins: number;
  draws: number;
  losses: number;
  color_index: number;
}
