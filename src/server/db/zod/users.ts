import { users } from '@/server/db/schema/users';
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
    created_at: true,
    selected_club: true,
    rating: true,
  })
  .extend({
    name: z.string().optional(),
  });

export type EditProfileFormType = z.infer<typeof editProfileFormSchema>;
