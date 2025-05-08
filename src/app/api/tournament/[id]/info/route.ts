import { db } from '@/lib/db';
import { clubs, tournaments } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tournamentInfo = (
      await db
        .select()
        .from(tournaments)
        .where(eq(tournaments.id, id))
        .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
    ).at(0);
    if (!tournamentInfo) throw new Error('TOURNAMENT NOT FOUND');
    if (!tournamentInfo.club) throw new Error('ORGANIZER CLUB NOT FOUND');
    return NextResponse.json(tournamentInfo, {
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
