import { users } from '@/lib/db/schema/auth';
import { InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('player', {
    id: text('id').primaryKey(),
    name: text('name'),
    nickname: text('nickname'),
    user_id: text('user_id').references(() => users.id),
    rating: int('rating'),
  });

  export type DatabasePlayer = InferSelectModel<typeof players>;