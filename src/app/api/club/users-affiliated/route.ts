import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema/players';
import { users } from '@/lib/db/schema/users';
import { and, eq, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED_REQUEST' },
        { status: 401 },
      );
    }

    const selectedClub = user.selected_club;
    const usersAffiliated = await db
      .select()
      .from(players)
      .where(and(eq(players.club_id, selectedClub), isNotNull(players.user_id)))
      .innerJoin(users, eq(users.id, players.user_id));

    return new Response(JSON.stringify(usersAffiliated), {
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
      },
    });
  }
}
