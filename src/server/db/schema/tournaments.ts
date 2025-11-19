import { clubs } from '@/server/db/schema/clubs';
import { players } from '@/server/db/schema/players';
import {
  Result,
  RoundName,
  TournamentFormat,
  TournamentType,
} from '@/types/tournaments';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const tournaments = sqliteTable('tournament', {
  id: text('id').primaryKey(),
  title: text('name'),
  format: text('format').$type<TournamentFormat>().notNull(),
  type: text('type').$type<TournamentType>().notNull(),
  date: text('date').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  club_id: text('club_id')
    .references(() => clubs.id)
    .notNull(),
  started_at: integer('started_at', { mode: 'timestamp' }),
  closed_at: integer('closed_at', { mode: 'timestamp' }),
  rounds_number: integer('rounds_number'), // necessary even if playing single elimination (final and match_for_third have same number);
  ongoing_round: integer('ongoing_round')
    .$default(() => 1)
    .notNull(),
  rated: integer('rated', { mode: 'boolean' })
    .notNull()
    .$default(() => false),
});

export const players_to_tournaments = sqliteTable('players_to_tournaments', {
  // join table where single tournament participants are stored
  id: text('id').primaryKey(),
  player_id: text('player_id')
    .notNull()
    .references(() => players.id),
  tournament_id: text('tournament_id')
    .notNull()
    .references(() => tournaments.id),
  wins: int('wins')
    .$default(() => 0)
    .notNull(),
  losses: int('losses')
    .$default(() => 0)
    .notNull(),
  draws: int('draws')
    .$default(() => 0)
    .notNull(),
  color_index: int('color_index')
    .$default(() => 0)
    .notNull(),
  place: int('place'),
  is_out: int('is_out', { mode: 'boolean' }),
  pairing_number: int('pairing_number'),
});

export const games = sqliteTable('game', {
  id: text('id').primaryKey(),
  game_number: integer('game_number').notNull(),
  round_number: integer('round_number').notNull(),
  round_name: text('round_name').$type<RoundName>(),
  white_id: text('white_id')
    .references(() => players.id)
    .notNull(),
  black_id: text('black_id')
    .references(() => players.id)
    .notNull(),
  white_prev_game_id: text('white_prev_game_id'),
  black_prev_game_id: text('black_prev_game_id'),
  result: text('result').$type<Result>(),
  tournament_id: text('tournament_id')
    .references(() => tournaments.id)
    .notNull(),
});

export const tournaments_relations = relations(
  tournaments,
  ({ one, many }) => ({
    club: one(clubs, { fields: [tournaments.club_id], references: [clubs.id] }),
    players: many(players_to_tournaments),
  }),
);

export const players_to_tournaments_relations = relations(
  players_to_tournaments,
  ({ one }) => ({
    player: one(players, {
      fields: [players_to_tournaments.player_id],
      references: [players.id],
    }),
    tournament: one(tournaments, {
      fields: [players_to_tournaments.tournament_id],
      references: [tournaments.id],
    }),
  }),
);

export type DatabaseTournament = InferSelectModel<typeof tournaments>;
export type DatabaseGame = InferSelectModel<typeof games>;
export type DatabasePlayerToTournament = InferSelectModel<
  typeof players_to_tournaments
>;
export type InsertDatabaseTournament = InferInsertModel<typeof tournaments>;

export type InsertDatabaseGame = InferInsertModel<typeof games>;
export type InsertDatabasePlayerToTournament = InferInsertModel<
  typeof players_to_tournaments
>;

export const tournamentsSelectSchema = createSelectSchema(tournaments);
export const gamesSelectSchema = createSelectSchema(games);
export const playersToTournamentsSelectSchema = createSelectSchema(
  players_to_tournaments,
);
export const tournamentsInsertSchema = createInsertSchema(tournaments);
export const gamesInsertSchema = createInsertSchema(games);
export const playersToTournamentsInsertSchema = createInsertSchema(
  players_to_tournaments,
);
export const tournamentsUpdateSchema = createUpdateSchema(tournaments);
export const gamesUpdateSchema = createUpdateSchema(games);
export const playersToTournamentsUpdateSchema = createUpdateSchema(
  players_to_tournaments,
);
