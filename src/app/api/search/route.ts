import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { clubs } from '@/lib/db/schema/clubs';
import { players } from '@/lib/db/schema/players';
import { tournaments } from '@/lib/db/schema/tournaments';
import { or, sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const filter = searchParams.get('filter');
  if (!query) return new Response(JSON.stringify([]), { status: 200 });
  const queryStr = `%${query}%`;
  if (filter === 'users') {
    const usersResult = await db
      .select()
      .from(users)
      .where(
        or(
          sql`lower(${users.name}) like lower(${queryStr})`,
          sql`lower(${users.username}) like lower(${queryStr})`,
        ),
      )
      .limit(15);
    return new Response(JSON.stringify({ users: usersResult }), {
      status: 200,
    });
  }
  const playersDb = db
    .select()
    .from(players)
    .where(sql`lower(${players.nickname}) like lower(${queryStr})`)
    .limit(5);
  const usersDb = db
    .select()
    .from(users)
    .where(
      or(
        sql`lower(${users.name}) like lower(${queryStr})`,
        sql`lower(${users.username}) like lower(${queryStr})`,
      ),
    )
    .limit(5);
  const tournamentsDb = db
    .select()
    .from(tournaments)
    .where(sql`lower(${tournaments.title}) like lower(${queryStr})`)
    .limit(5);
  const clubsDb = db
    .select()
    .from(clubs)
    .where(sql`lower(${clubs.name}) like lower(${queryStr})`)
    .limit(5);

  const [playersResult, usersResult, tournamentsResult, clubsResult] =
    await Promise.all([playersDb, usersDb, tournamentsDb, clubsDb]);

  const data = {
    players: playersResult,
    users: usersResult,
    tournaments: tournamentsResult,
    clubs: clubsResult,
  };
  return new Response(JSON.stringify(data), { status: 200 });
}
