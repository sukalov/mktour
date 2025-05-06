'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import {
  affiliations,
  InsertDatabaseAffiliation,
  InsertDatabaseNotification,
  notifications,
} from '@/lib/db/schema/notifications';
import { players } from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';

export async function requestAffiliation({
  playerId,
  userId,
  clubId,
}: {
  playerId: string;
  userId: string;
  clubId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

  const [existingPlayers, existingAffiliations] = await Promise.all([
    db
      .select()
      .from(players)
      .where(and(eq(players.user_id, userId), eq(players.club_id, clubId))),
    db
      .select()
      .from(affiliations)
      .where(
        and(eq(affiliations.user_id, userId), eq(affiliations.club_id, clubId)),
      ),
  ]);
  if (existingAffiliations.at(0) || existingPlayers.at(0))
    throw new Error('AFFILIATION_EXISTS');

  const created_at = new Date();

  const newAffiliation: InsertDatabaseAffiliation = {
    id: newid(),
    user_id: userId,
    player_id: playerId,
    club_id: clubId,
    status: 'requested',
    created_at,
    updated_at: created_at,
  };

  const newNotification: InsertDatabaseNotification = {
    id: newid(),
    user_id: userId,
    club_id: clubId,
    sent_by: 'user',
    notification_type: 'affiliation_request',
    is_seen: false,
    created_at,
    metadata: { affiliation_id: newAffiliation.id },
  };

  await Promise.all([
    db.insert(affiliations).values(newAffiliation),
    db.insert(notifications).values(newNotification),
  ]);
}
