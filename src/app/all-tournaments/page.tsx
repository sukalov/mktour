import { db } from "@/lib/db";
import { tournaments } from "@/lib/db/schema/tournaments";

export default async function Tournaments() {
  const allTournaments = await db.select().from(tournaments)
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <pre>{JSON.stringify(allTournaments, null , 2)}</pre>
    </main>
  );
}
