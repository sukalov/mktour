import { apiTokens, sessions, users } from '@/server/db/schema/users';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import z from 'zod';

export const usersSelectSchema = createSelectSchema(users);
export const usersInsertSchema = createInsertSchema(users);
export const usersUpdateSchema = createUpdateSchema(users);

export const editProfileFormSchema = usersUpdateSchema
  .omit({
    id: true,
    username: true,
    email: true,
    createdAt: true,
    selectedClub: true,
    rating: true,
  })
  .extend({
    name: z.string().optional(),
  });

export const apiTokensSelectSchema = createSelectSchema(apiTokens);
export const apiTokensInsertSchema = createInsertSchema(apiTokens);

export const apiTokenList = apiTokensSelectSchema.pick({
  id: true,
  name: true,
  createdAt: true,
  lastUsedAt: true,
});

export const sessionsSelectSchema = createSelectSchema(sessions);
export const sessionsInsertSchema = createInsertSchema(sessions);

export type EditProfileFormType = z.infer<typeof editProfileFormSchema>;
export type ApiTokenList = z.infer<typeof apiTokenList>;
