import { StatusInClub } from '@/server/db/schema/clubs';
import { User } from 'lucia';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userClubs: [],
  affiliatedPlayers: [],
});

export type AuthContextType = {
  user: User | null | undefined;
  userClubs:
    | {
        [club_id: string]: StatusInClub; // "admin" | "co-owner"
      }[]
    | undefined;
  affiliatedPlayers:
    | {
        [club_id: string]: string; // player-id
      }[]
    | undefined;
};
