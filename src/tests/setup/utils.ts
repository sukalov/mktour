import { db } from '@/server/db';
import * as schema from '@/server/db/schema';

export const cleanupTestDb = async () => {
  // cleaning all tables in correct order to handle foreign key constraints
  await db.delete(schema.user_notifications);
  await db.delete(schema.club_notifications);
  await db.delete(schema.apiTokens);
  await db.delete(schema.sessions);
  await db.delete(schema.user_preferences);
  await db.delete(schema.games);
  await db.delete(schema.players_to_tournaments);
  await db.delete(schema.affiliations);
  await db.delete(schema.players);
  await db.delete(schema.tournaments);
  await db.delete(schema.clubs_to_users);
  await db.delete(schema.users);
  await db.delete(schema.clubs);
};

export const getSeededTestData = async () => {
  const users = await db.select().from(schema.users).limit(5);
  const clubs = await db.select().from(schema.clubs).limit(3);
  const tournaments = await db.select().from(schema.tournaments).limit(3);
  const players = await db.select().from(schema.players).limit(10);

  return {
    users,
    clubs,
    tournaments,
    players,
    firstUser: users[0],
    firstClub: clubs[0],
    firstTournament: tournaments[0],
    firstPlayer: players[0],
  };
};
