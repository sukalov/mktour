import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema/notifications';
import { and, eq } from 'drizzle-orm';
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
      );

    console.log(notifications.metadata.getSQL);
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
