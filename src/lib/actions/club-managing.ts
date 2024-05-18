'use server'

import { getUser } from "@/lib/auth/utils";
import { newid } from "@/lib/utils";
import { NewClubFormType } from "@/lib/zod/new-club-form";

export const createClub = async (values: NewClubFormType) => {
    const user = await getUser();
    if (!user) return;
    
    const newClub = {
        name: values.name,
        id: newid(),
        description: values.description,
        created_at: values.timestamp,
        lichess_team: values.lichess_team,
    }
}