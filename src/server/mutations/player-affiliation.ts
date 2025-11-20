'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { newid } from '@/lib/utils';
import { db } from '@/server/db';
import {
  club_notifications,
  InsertDatabaseClubNotification,
  InsertDatabaseUserNotification,
  user_notifications,
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
      .where(and(eq(players.userId, userId), eq(players.clubId, clubId))),
    db
      .select()
      .from(affiliations)
      .where(
        and(eq(affiliations.userId, userId), eq(affiliations.clubId, clubId)),
      ),
  ]);
  if (existingAffiliations.at(0) || existingPlayers.at(0))
    throw new Error('AFFILIATION_EXISTS');

  const createdAt = new Date();

  const newAffiliation: InsertDatabaseAffiliation = {
    id: newid(),
    userId: userId,
    playerId: playerId,
    clubId: clubId,
    status: 'requested',
    createdAt,
    updatedAt: createdAt,
  };

  const newNotification: InsertDatabaseClubNotification = {
    id: newid(),
    clubId: clubId,
    event: 'affiliation_request',
    isSeen: false,
    createdAt,
    metadata: { affiliationId: newAffiliation.id, userId },
  };

  await Promise.all([
    db.insert(affiliations).values(newAffiliation),
    db.insert(club_notifications).values(newNotification),
  ]);
  revalidatePath(`/player/${playerId}`);
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
  if (affiliation.clubId !== user.selectedClub)
    throw new Error('CLUB_ID_NOT_MATCHING');
  if (affiliation.status !== 'requested')
    throw new Error('AFFILIATION_STATUS_NOT_REQUESTED');

  const newNotification: InsertDatabaseUserNotification = {
    id: newid(),
    userId: affiliation.userId,
    event: 'affiliation_approved',
    isSeen: false,
    createdAt: new Date(),
    metadata: { clubId: affiliation.clubId, affiliationId: affiliationId },
  };

  await Promise.all([
    db
      .update(affiliations)
      .set({ status: 'active', updatedAt: new Date() })
      .where(eq(affiliations.id, affiliationId)),
    db
      .update(players)
      .set({ userId: affiliation.userId })
      .where(eq(players.id, affiliation.playerId)),
    db
      .update(club_notifications)
      .set({ isSeen: true, event: 'affiliation_request_approved' })
      .where(eq(club_notifications.id, notificationId)),
    db.insert(user_notifications).values(newNotification),
  ]);
  revalidatePath(`/player/${affiliation.playerId}`);

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
  if (affiliation.clubId !== user.selectedClub)
    throw new Error('CLUB_ID_NOT_MATCHING');
  if (affiliation.status !== 'requested')
    throw new Error('AFFILIATION_STATUS_NOT_REQUESTED');

  const newNotification: InsertDatabaseUserNotification = {
    id: newid(),
    userId: affiliation.userId,
    event: 'affiliation_rejected',
    isSeen: false,
    createdAt: new Date(),
    metadata: { clubId: affiliation.clubId, affiliationId: affiliationId },
  };

  await Promise.all([
    db
      .update(affiliations)
      .set({ status: 'cancelled_by_club', updatedAt: new Date() })
      .where(eq(affiliations.id, affiliationId)),
    db
      .update(club_notifications)
      .set({ isSeen: true, event: 'affiliation_request_rejected' })
      .where(eq(club_notifications.id, notificationId)),
    db.insert(user_notifications).values(newNotification),
  ]);
  revalidatePath(`/player/${affiliation.playerId}`);

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
      .delete(club_notifications)
      .where(
        sql`json_extract(${club_notifications.metadata}, '$.affiliation_id') = ${affiliationId}`,
      ),
  ]);
  revalidatePath(`/player/${playerId}`);

  return affiliation;
}
