import { validateNewPlayer } from '@/lib/zod/new-player-validation-action';
import * as z from 'zod';

export const newPlayerFormSchema = z
  .object({
    name: z.string().min(1, 'name'),
    rating: z
      .number()
      .min(0, {
        error: 'min rating',
      })
      .max(3000, {
        error: 'max rating',
      }),
    club_id: z.string(),
  })
  .refine(
    async (data) => {
      return await validateNewPlayer(data);
    },
    { error: 'player exists error', path: ['name'] },
  );

export type NewPlayerFormType = z.infer<typeof newPlayerFormSchema>;
