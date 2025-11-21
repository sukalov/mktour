import {
  club_notifications,
  user_notifications,
} from '@/server/db/schema/notifications';
import { clubNotificationEventEnum } from '@/server/db/zod/enums';
import {
  affiliationsSelectSchema,
  playersSelectSchema,
} from '@/server/db/zod/players';
import { usersSelectSchema } from '@/server/db/zod/users';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import z from 'zod';

export const userNotificationsSelectSchema =
  createSelectSchema(user_notifications);
export const clubNotificationsSelectSchema = createSelectSchema(
  club_notifications,
  {
    event: clubNotificationEventEnum,
  },
);
export const userNotificationsInsertSchema =
  createInsertSchema(user_notifications);
export const clubNotificationsInsertSchema =
  createInsertSchema(club_notifications);
export const userNotificationsUpdateSchema =
  createUpdateSchema(user_notifications);
export const clubNotificationsUpdateSchema =
  createUpdateSchema(club_notifications);

export const clubNotificationExtendedSchema = z.object({
  event: clubNotificationEventEnum,
  notification: clubNotificationsSelectSchema,
  affiliation: affiliationsSelectSchema.nullable(),
  user: usersSelectSchema.nullable(),
  player: playersSelectSchema.nullable(),
});

export type ClubNotificationExtended = z.infer<
  typeof clubNotificationExtendedSchema
>;
