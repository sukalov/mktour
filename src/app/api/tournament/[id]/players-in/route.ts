import { db } from '@/lib/db';
import { players, players_to_tournaments } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const playersDb = await db
      .select()
      .from(players_to_tournaments)
      .where(eq(players_to_tournaments.tournament_id, id))
      .leftJoin(players, eq(players.id, players_to_tournaments.player_id));

    const playerModels = playersDb.map((each) => ({
      id: each.player!.id,
      nickname: each.player!.nickname,
      realname: each.player?.realname,
      rating: each.player!.rating,
      wins: each.players_to_tournaments.wins,
      draws: each.players_to_tournaments.draws,
      losses: each.players_to_tournaments.losses,
      color_index: each.players_to_tournaments.color_index,
      exited: each.players_to_tournaments.out,
      place: each.players_to_tournaments.place,
    }));

    const data = playerModels.sort(
      (a, b) => b.wins + b.draws / 2 - (a.wins + a.draws / 2),
    );

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store, no-cache, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json(
      { error: errorMessage },
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-store, no-cache, max-age=0, must-revalidate',
        },
      },
    );
  }
}
