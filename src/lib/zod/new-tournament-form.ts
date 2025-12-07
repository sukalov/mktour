import { TournamentFormat, TournamentType } from '@/types/tournaments';
import * as z from 'zod';

export const newTournamentFormSchema = z.object({
  title: z
    .string({ required_error: 'hard naming' })
    .min(1, { message: 'hard naming' })
    .min(3, { message: 'short tournament name' }),
  date: z.date().min(new Date(new Date().setDate(new Date().getDate() - 1)), {
    message: 'time travel',
  }),
  format: z.custom<TournamentFormat>(),
  type: z.custom<TournamentType>(),
  timestamp: z.number(),
  club_id: z.string(),
  rated: z.boolean(),
});

export type NewTournamentFormType = z.infer<typeof newTournamentFormSchema>;
