import { db } from '@/lib/db';
import { DatabasePlayer, players } from '@/lib/db/schema/players';
import {
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = (await db.all(sql`
    SELECT p.*
    FROM ${players} p
    LEFT JOIN ${players_to_tournaments} pt
      ON p.id = pt.player_id AND pt.tournament_id = ${id}
    WHERE p.club_id = (
      SELECT t.club_id
      FROM ${tournaments} t
      WHERE t.id = ${id}
    )
    AND pt.player_id IS NULL;
  `)) as Array<DatabasePlayer>;

    return NextResponse.json(result, {
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
