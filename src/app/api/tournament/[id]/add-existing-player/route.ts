import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { getStatusInTournament } from '@/lib/db/queries/get-status-in-tournament';
import {
  DatabasePlayer,
  players_to_tournaments,
} from '@/lib/db/schema/tournaments';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: tournamentId } = await params;
    const body: AddExistingPlayerBody = await req.json();
    const { player, userId } = body;

    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED_REQUEST' },
        { status: 401 },
      );
    }
    if (user.id !== userId) {
      return NextResponse.json({ error: 'USER_NOT_MATCHING' }, { status: 403 });
    }

    const status = await getStatusInTournament(user, tournamentId);
    if (status === 'viewer') {
      return NextResponse.json({ error: 'NOT_ADMIN' }, { status: 403 });
    }

    const playerToTournament = {
      player_id: player.id,
      tournament_id: tournamentId,
      id: `${player.id}=${tournamentId}`,
      wins: 0,
      losses: 0,
      draws: 0,
      color_index: 0,
      place: null,
      out: null,
      pairing_number: null,
    };

    await db.insert(players_to_tournaments).values(playerToTournament);

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export interface AddExistingPlayerBody {
  player: DatabasePlayer;
  userId: string;
}
