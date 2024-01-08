'use server';
import { NewTournamentForm } from "@/app/new-tournament/new-tournament-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from '@/app/api/auth/[...nextauth]/options';

export const createTournament = async (values: NewTournamentForm) => {
  const user = (await getServerSession(options))?.user.username;
  const newTournament = {...values,
    timestamp: new Date().toISOString(),
    user
  }
  console.log(newTournament)
    redirect('/issues')
  }