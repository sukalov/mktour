import { db } from '@/lib/db';
import { DatabaseClub, DatabasePlayer, clubs, players } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function usePlayerQuery(id: string) {
    const result = (
        await db
          .select()
          .from(players)
          .where(eq(players.id, id))
          .leftJoin(clubs, eq(players.club_id, clubs.id))
      ).at(0) as PlayerToClubLeftJoin;
    
      if (!result?.player || !result?.club)
        return { player: undefined, club: undefined };
      return { player: result.player, club: result.club };
    }

interface PlayerToClubLeftJoin {
    player: DatabasePlayer,
    club: DatabaseClub
}