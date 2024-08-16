'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { DatabaseUser, users } from '@/lib/db/schema/auth';
import {
  DatabaseClub,
  DatabaseClubsToUsers,
  DatabasePlayer,
  clubs,
  clubs_to_users,
  games,
  players,
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { NewClubFormType } from '@/lib/zod/new-club-form';
import { and, eq, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const createClub = async (values: NewClubFormType) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('unauthorized request');
  const id = newid();
  const newClub = {
    ...values,
    id,
  };
  const newRelation: DatabaseClubsToUsers = {
    id: `${user.id}=${id}`,
    club_id: id,
    user_id: user.id,
    status: 'admin',
  };
  try {
    await db.insert(clubs).values(newClub);
    await db.insert(clubs_to_users).values(newRelation);
    await db
      .update(users)
      .set({ selected_club: id })
      .where(eq(users.id, user.id));
  } catch (e) {
    throw new Error('club has NOT been saved');
  }
  redirect('/club/dashboard');
};

export const getClubInfo = async (id: DatabaseClub['id']) => {
  return (await db.select().from(clubs).where(eq(clubs.id, id)))?.at(0);
};

export const getClubPlayers = async (id: DatabasePlayer['club_id']) => {
  return await db.select().from(players).where(eq(players.club_id, id));
};

export const editClub = async ({ id, values }: UpdateDatabaseClub) => {
  await db.update(clubs).set(values).where(eq(clubs.id, id));
};

type UpdateDatabaseClub = {
  id: string;
  userId: string;
  values: Partial<DatabaseClub>;
};

export const deleteClub = async ({ id, userId }: UpdateDatabaseClub) => {
  const otherClubs = await db
    .select()
    .from(clubs_to_users)
    .where(
      and(eq(clubs_to_users.user_id, userId), ne(clubs_to_users.club_id, id)),
    )
    .limit(1);

  if (otherClubs.length === 0) throw new Error('ZERO_CLUBS');
  await db
    .update(users)
    .set({ selected_club: otherClubs[0].club_id })
    .where(eq(users.id, userId));

  await db.transaction(async (tx) => {
    await tx
      .delete(games)
      .where(
        eq(
          games.tournament_id,
          tx
            .select({ id: tournaments.id })
            .from(tournaments)
            .where(eq(tournaments.club_id, id)),
        ),
      );
    await tx
      .delete(players_to_tournaments)
      .where(
        eq(
          players_to_tournaments.tournament_id,
          tx
            .select({ id: tournaments.id })
            .from(tournaments)
            .where(eq(tournaments.club_id, id)),
        ),
      );
    await tx.delete(players).where(eq(players.club_id, id));
    await tx.delete(clubs_to_users).where(eq(clubs_to_users.club_id, id));
    await tx.delete(tournaments).where(eq(tournaments.club_id, id));
    await tx.delete(clubs).where(eq(clubs.id, id));
  });
  console.log('CLUB DELETED', id);
};

// FIXME 
export const deletePlayer = async (playerId: string) => {
  await db.transaction(async (tx) => {
    await tx.delete(players).where(eq(players.id, playerId));
  });
};

export default async function getAllClubManagers(
  club_id: string,
): Promise<ClubManagers[]> {
  return await db
    .select()
    .from(clubs_to_users)
    .where(eq(clubs_to_users.club_id, club_id))
    .leftJoin(users, eq(clubs_to_users.user_id, users.id))
}

export type ClubManagers = {
  clubs_to_users: DatabaseClubsToUsers | null
  user: DatabaseUser | null
}