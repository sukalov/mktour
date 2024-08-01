import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { validateLichessTeam } from '@/lib/zod/new-club-validation-action';
import * as z from 'zod';

let team: DatabaseClub | undefined
export const newClubFormSchema = z
  .object({
    name: z
      .string({ required_error: 'naming is hard, but necessary' })
      .min(3, { message: 'too short for a chess club name' }),
    description: z.string().optional(),
    created_at: z.date().optional(),
    lichess_team: z.string().optional(),
  })
  .refine(
    async (data) => {
      team = await validateLichessTeam(data);
      return !team
    },
    (_data) => {
      return { message: `club linked to ${team?.name} already exists!`, path: ['lichess_team'] }
    },
  );

export type NewClubFormType = z.infer<typeof newClubFormSchema>;

// const Message = ({ _key }: { key: number }) => {
//   return (
//     <span key={team?.id}>
//       this team already has {team ? team.name : null}{' '}
//       <a
//         className="font-semibold underline underline-offset-2"
//         href="https://google.com"
//       >
//         mktour club
//       </a>
//       !
//     </span>
//   );
// };
