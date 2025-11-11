import { validateNewPlayer } from '@/lib/zod/new-player-validation-action';
import * as z from 'zod';

export const playerSchema = {
  id: z.string(),
  nickname: z.string(),
  rating: z
    .number()
    .min(0, {
      error: 'min rating',
    })
    .max(3000, {
      error: 'max rating',
    }),
  club_id: z.string(),
  user_id: z.string().optional(),
  realname: z.string().optional().nullable(),
};

export const newPlayerFormSchema = z.object(playerSchema).refine(
  async (data) => {
    return await validateNewPlayer(data);
  },
  { error: 'player exists error', path: ['nickname'] },
);

export type NewPlayerFormType = z.infer<typeof newPlayerFormSchema>;
