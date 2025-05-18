'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { newid } from '@/lib/utils';
import { db } from '@/server/db';
import {
  InsertDatabaseNotification,
  notifications,
} from '@/server/db/schema/notifications';
import {
  affiliations,
  InsertDatabaseAffiliation,
  players,
} from '@/server/db/schema/players';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
    for_whom: 'club',
    notification_type: 'affiliation_request',
    is_seen: false,
    created_at,
    metadata: { affiliation_id: newAffiliation.id },
  };

  await Promise.all([
    db.insert(affiliations).values(newAffiliation),
    db.insert(notifications).values(newNotification),
  ]);
  revalidatePath(`/players/${playerId}`);
}

export async function acceptAffiliation({
  affiliationId,
  notificationId,
}: {
  affiliationId: string;
  notificationId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');

  const affiliation = await db.query.affiliations.findFirst({
    where: eq(affiliations.id, affiliationId),
  });

  if (!affiliation) throw new Error('AFFILIATION_NOT_FOUND');
  if (affiliation.club_id !== user.selected_club)
    throw new Error('CLUB_ID_NOT_MATCHING');
  if (affiliation.status !== 'requested')
    throw new Error('AFFILIATION_STATUS_NOT_REQUESTED');

  await Promise.all([
    db
      .update(affiliations)
      .set({ status: 'active', updated_at: new Date() })
      .where(eq(affiliations.id, affiliationId)),
    db
      .update(players)
      .set({ user_id: affiliation.user_id })
      .where(eq(players.id, affiliation.player_id)),
    db.delete(notifications).where(eq(notifications.id, notificationId)),
  ]);

  return affiliation;
}

export async function rejectAffiliation({
  affiliationId,
  notificationId,
}: {
  affiliationId: string;
  notificationId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');

  const affiliation = await db.query.affiliations.findFirst({
    where: eq(affiliations.id, affiliationId),
  });
  if (!affiliation) throw new Error('AFFILIATION_NOT_FOUND');
  if (affiliation.club_id !== user.selected_club)
    throw new Error('CLUB_ID_NOT_MATCHING');
  if (affiliation.status !== 'requested')
    throw new Error('AFFILIATION_STATUS_NOT_REQUESTED');

  await Promise.all([
    db
      .update(affiliations)
      .set({ status: 'cancelled_by_club', updated_at: new Date() })
      .where(eq(affiliations.id, affiliationId)),
    db.delete(notifications).where(eq(notifications.id, notificationId)),
  ]);

  return affiliation;
}
export async function abortAffiliationRequest({
  userId,
  playerId,
  affiliationId,
}: {
  userId: string;
  playerId: string;
  affiliationId: string;
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

  const affiliation = await db.query.affiliations.findFirst({
    where: eq(affiliations.id, affiliationId),
  });
  if (!affiliation) throw new Error('AFFILIATION_NOT_FOUND');
  if (affiliation.status !== 'requested')
    throw new Error('AFFILIATION_STATUS_NOT_REQUESTED');

  await Promise.all([
    db.delete(affiliations).where(eq(affiliations.id, affiliationId)),
    db
      .delete(notifications)
      .where(
        sql`json_extract(${notifications.metadata}, '$.affiliation_id') = ${affiliationId}`,
      ),
  ]);
  revalidatePath(`/players/${playerId}`);

  return affiliation;
}
