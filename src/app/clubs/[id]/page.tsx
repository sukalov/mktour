import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema/tournaments";
import { eq } from "drizzle-orm";

export default async function ClubPage({ params }: ClubPageProps) {
  
const club = await db.select().from(clubs).where(eq(clubs.id, params.id))
  
    return (
      <div className="w-full">
        <pre>
            {JSON.stringify(club, null, 2)}
        </pre>
      </div>
    );
  }
  
  export interface ClubPageProps {
    params: { id: string };
  }
  