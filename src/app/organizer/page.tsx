import { getTournamentState } from "@/lib/get-tournament-state";

export default async function OrganizerPage() {
  const tmt = await getTournamentState('OuFEd-CU3jhYKpP-e-SIk')
  return <div>
    <pre>
      {JSON.stringify(tmt, null, 2)}
    </pre>
  </div>;
}
