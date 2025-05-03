import { setTournamentGameResult } from '@/lib/actions/tournament-managing';
import { validateRequest } from '@/lib/auth/lucia';
import { getStatusInTournament } from '@/lib/db/queries/get-status-in-tournament';
import { Result } from '@/types/tournaments';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: tournamentId } = await params;
    const body: SetGameResultBody = await req.json();
    const { userId, ...props } = body;

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

    const result = await setTournamentGameResult(props);
    if (result === 'TOURNAMENT_NOT_STARTED') {
      return NextResponse.json(
        { error: 'TOURNAMENT_NOT_STARTED' },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export interface SetGameResultBody {
  tournamentId: string;
  gameId: string;
  whiteId: string;
  blackId: string;
  result: Result;
  prevResult: Result | null;
  roundNumber: number;
  userId: string;
}
