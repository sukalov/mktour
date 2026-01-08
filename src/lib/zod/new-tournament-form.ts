import { TournamentFormat, TournamentType } from '@/server/db/zod/enums';
import * as z from 'zod';

export const newTournamentFormSchemaConfig = {
  title: z.string().optional(),
  date: z.date().min(new Date(new Date().setDate(new Date().getDate() - 1)), {
    error: 'time travel',
  }),
  format: z.custom<TournamentFormat>(),
  type: z.custom<TournamentType>(),
  timestamp: z.number(),
  clubId: z.string(),
  rated: z.boolean(),
};

export const newTournamentFormSchema = z.object(newTournamentFormSchemaConfig);

export type NewTournamentFormType = z.infer<typeof newTournamentFormSchema>;
