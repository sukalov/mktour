import * as z from 'zod';

export const editProfileFormSchema = z.object({
  name: z
    .string()
    .optional(),
  id: z.string(),
});

export type EditProfileFormType = z.infer<typeof editProfileFormSchema>;
