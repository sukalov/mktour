import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { and, eq, sql } from 'drizzle-orm';
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
    const clubNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.club_id, selectedClub),
          eq(notifications.for_whom, 'club'),
        ),
      )
      .leftJoin(
        affiliations,
        sql`json_extract(${notifications.metadata}, '$.affiliation_id') = ${affiliations.id}`,
      )
      .leftJoin(users, eq(users.id, affiliations.user_id))
      .leftJoin(players, eq(players.id, affiliations.player_id));

    return new Response(JSON.stringify(clubNotifications), {
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
