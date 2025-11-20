import { affiliations, players } from '@/server/db/schema/players';
import { affiliationStatusEnum } from '@/server/db/zod/enums';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';

export const playersSelectSchema = createSelectSchema(players);
export const playersInsertSchema = createInsertSchema(players);
export const playersUpdateSchema = createUpdateSchema(players);
export const affiliationsSelectSchema = createSelectSchema(affiliations, {
  status: affiliationStatusEnum,
});
export const affiliationsInsertSchema = createInsertSchema(affiliations);
export const affiliationsUpdateSchema = createUpdateSchema(affiliations);
