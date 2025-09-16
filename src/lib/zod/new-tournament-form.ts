import { TournamentFormat, TournamentType } from '@/types/tournaments';
import * as z from 'zod';

export const newTournamentFormSchema = z.object({
  title: z
    .string({ error: 'hard naming' })
    .min(1, { error: 'hard naming' })
    .min(3, { error: 'short tournament name' }),
  date: z.date().min(new Date(new Date().setDate(new Date().getDate() - 1)), {
    error: 'time travel',
  }),
  format: z.custom<TournamentFormat>(),
  type: z.custom<TournamentType>(),
  timestamp: z.number(),
  club_id: z.string(),
  rated: z.boolean(),
});

export type NewTournamentFormType = z.infer<typeof newTournamentFormSchema>;
