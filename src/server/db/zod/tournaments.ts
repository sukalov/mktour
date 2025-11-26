import { games, tournaments } from '@/server/db/schema/tournaments';
import { clubsSelectSchema } from '@/server/db/zod/clubs';
import {
  tournamentFormatEnum,
  tournamentTypeEnum,
} from '@/server/db/zod/enums';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import z from 'zod';

export const tournamentsSelectSchema = createSelectSchema(tournaments, {
  format: tournamentFormatEnum,
  type: tournamentTypeEnum,
});
export const gamesSelectSchema = createSelectSchema(games);
export const tournamentsInsertSchema = createInsertSchema(tournaments);
export const gamesInsertSchema = createInsertSchema(games);
export const tournamentsUpdateSchema = createUpdateSchema(tournaments);
export const gamesUpdateSchema = createUpdateSchema(games);

export const tournamentInfoSchema = z.object({
  tournament: tournamentsSelectSchema,
  club: clubsSelectSchema,
});
export type TournamentInfo = z.infer<typeof tournamentInfoSchema>;
