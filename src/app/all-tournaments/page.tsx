import useAllTournamentsQuery from "@/lib/db/hooks/useAllTournamentsQuery";

export default async function Tournaments() {
  const { allTournaments } = await useAllTournamentsQuery()
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <pre>{JSON.stringify(allTournaments, null , 2)}</pre>
    </main>
  );
}
