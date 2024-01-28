'use client'

import TeamJoinToaster from "@/components/team-join-toaster";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";

const CreateTournamentButton: FC<CreateTournamentButtonProps> = ({ isNew, token }) => {
  return (
    <Link href="/new-tournament" className="m-auto w-full px-1">
      <Button
        className="m-auto flex h-28 min-h-28 w-full max-w-[28rem] flex-col gap-2 font-bold"
        variant="default"
      >
        <h1 className=" text-2xl font-light min-[320px]:text-3xl">
          make tourname
        </h1>
        <p className="text-balance font-extralight"></p>
      </Button>
      {isNew && token && <TeamJoinToaster token={token} />}
    </Link>
  );
};

type CreateTournamentButtonProps = {
  isNew: boolean | null
  token: string | undefined
}

export default CreateTournamentButton