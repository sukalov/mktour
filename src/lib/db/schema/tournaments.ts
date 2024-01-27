import { users } from '@/lib/db/schema/auth';
import { Format, Result, TournamentType } from '@/types/tournaments';
import { InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('player', {
  id: text('id').primaryKey(),
  name: text('name'),
  nickname: text('nickname'),
  user_id: text('user_id').references(() => users.id),
  rating: int('rating'),
});

export const tournaments = sqliteTable('tournament', {
  id: text('id').primaryKey(),
  name: text('name'),
  format: text('format').$type<Format>(),
  type: text('type').$type<TournamentType>(),
  date: text('date').$type<ValidModernISODate>(),
  timestamp: text('timestamp'),
  user_id: text('user_id').references(() => users.id),
});

export const playersToTournaments = sqliteTable('players_to_tournaments', {
  // join table where single tournament participants are stored
  player_id: text('player_id')
    .notNull()
    .references(() => players.id),
  tournament_id: text('tournament_id')
    .notNull()
    .references(() => tournaments.id),
  wins: int('wins').$default(() => 0),
  losses: int('losses').$default(() => 0),
  draws: int('draws').$default(() => 0),
  color_index: int('color_index').$default(() => 0),
});
export const games = sqliteTable('game', {
  id: text('id').primaryKey(),
  white_id: text('white_id').references(() => players.id),
  black_id: text('black_id').references(() => players.id),
  result: text('result').$type<Result>(),
  tournament_id: text('tournament_id').references(() => tournaments.id),
});

export type DatabasePlayer = InferSelectModel<typeof players>;
export type DarabaseTournament = InferSelectModel<typeof tournaments>;
export type DarabaseGame = InferSelectModel<typeof games>;
export type DatabasePlayerToTournament = InferSelectModel<typeof playersToTournaments>;
