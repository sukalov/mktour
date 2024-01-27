'use server';

import { db } from '@/lib/db';
import { players } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function addPlayer(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    name: z.string().min(1),
  });
  const parse = schema.safeParse({
    name: formData.get('name'),
  });

  if (!parse.success) {
    return { message: 'failed to add player' };
  }

  const data = parse.data;

  try {
    const id = nanoid();
    console.log(id, data.name);
    await db.insert(players).values({ id, name: data.name });
    revalidatePath('/');
    return { message: `added player ${data.name}` };
  } catch (e) {
    return { message: 'failed to add player' };
  }
}

export async function deletePlayer(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
  });
  const data = schema.parse({
    id: formData.get('id'),
    name: formData.get('name'),
  });

  try {
    await db.delete(players).where(eq(players.id, data.id));
    revalidatePath('/');
    return { message: `deleted player ${data.name}` };
  } catch (e) {
    return { message: 'failed to delete player' };
  }
}
