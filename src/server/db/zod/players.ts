import { affiliations, players } from '@/server/db/schema/players';
import { affiliationStatusEnum } from '@/server/db/zod/enums';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import z from 'zod';

export const playersSelectSchema = createSelectSchema(players);
export const playersInsertSchema = createInsertSchema(players);
export const playersUpdateSchema = createUpdateSchema(players);
export const affiliationsSelectSchema = createSelectSchema(affiliations, {
  status: affiliationStatusEnum,
});
export const affiliationsInsertSchema = createInsertSchema(affiliations);
export const affiliationsUpdateSchema = createUpdateSchema(affiliations);

export const affiliationExtendedSchema = affiliationsSelectSchema
  .extend({
    player: playersSelectSchema,
  })
  .omit({ playerId: true, clubId: true });

export const affiliationMinimalSchema = affiliationsSelectSchema.omit({
  playerId: true,
  clubId: true,
  userId: true,
});

export const playersMinimalSchema = playersSelectSchema.omit({
  clubId: true,
});

export type AffiliationExtended = z.infer<typeof affiliationExtendedSchema>;
export type AffiliationMinimal = z.infer<typeof affiliationMinimalSchema>;
export type Player = z.infer<typeof playersSelectSchema>;
export type PlayerMinimal = z.infer<typeof playersMinimalSchema>;
