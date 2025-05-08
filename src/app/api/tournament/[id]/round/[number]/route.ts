import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { getStatusInTournament } from '@/lib/db/queries/get-status-in-tournament';
import { games, players, tournaments } from '@/lib/db/schema/tournaments';
import { GameModel } from '@/types/tournaments';
import { aliasedTable, and, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; number: string }> },
) {
  try {
    const { id: tournamentId, number: roundNumberString } = await params;
    const roundNumber = Number(roundNumberString);
    if (isNaN(roundNumber)) throw new Error('INVALID_ROUND_NUMBER');
    const whitePlayer = aliasedTable(players, 'white_player');
    const blackPlayer = aliasedTable(players, 'black_player');
    const gamesDb = await db
      .select({
        id: games.id,
        tournament_id: games.tournament_id,
        black_id: games.black_id,
        white_id: games.white_id,
        black_nickname: blackPlayer.nickname,
        white_nickname: whitePlayer.nickname,
        round_number: games.round_number,
        game_number: games.game_number,
        round_name: games.round_name || null,
        white_prev_game_id: games.white_prev_game_id || null,
        black_prev_game_id: games.black_prev_game_id || null,
        result: games.result || null,
      })
      .from(games)
      .where(
        and(
          eq(games.tournament_id, tournamentId),
          eq(games.round_number, roundNumber),
        ),
      )
      .leftJoin(whitePlayer, eq(games.white_id, whitePlayer.id))
      .leftJoin(blackPlayer, eq(games.black_id, blackPlayer.id));

    const data = gamesDb.sort((a, b) => a.game_number - b.game_number);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store, no-cache, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store, no-cache, max-age=0, must-revalidate',
      },
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; number: string }> },
) {
  try {
    const { id: tournamentId, number: roundNumberString } = await params;
    const roundNumber = Number(roundNumberString);
    const newGames: GameModel[] = await req.json();
    const { user } = await validateRequest();
    if (!user) throw new Error('UNAUTHORIZED_REQUEST');
    const status = await getStatusInTournament(user, tournamentId);
    if (status === 'viewer') throw new Error('NOT_ADMIN');
    const cleanupPromises = [
      db
        .delete(games)
        .where(
          and(
            eq(games.tournament_id, tournamentId),
            eq(games.round_number, roundNumber),
          ),
        ),
      db
        .update(tournaments)
        .set({ ongoing_round: roundNumber })
        .where(eq(tournaments.id, tournamentId)),
    ];

    await Promise.all(cleanupPromises);

    let insertPromises: Promise<any>[] = [];
    newGames.forEach((game) => {
      const { white_nickname, black_nickname, ...newGame } = game;
      insertPromises.push(db.insert(games).values(newGame));
    });
    await Promise.all(insertPromises);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
