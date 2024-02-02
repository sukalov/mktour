import { validateRequest } from "@/lib/auth/lucia";
import Link from "next/link";
import TournamentDashboard from "@/app/test-socket/[tournament_id]/tournament-dashboard";
import { PARTYKIT_URL, PARTYKIT_HOST } from "@/lib/env";
import { redirect } from "next/navigation";

const party = "tournament";

export const revalidate = 0;

export default async function ChatRoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const { user } = await validateRequest();
  if (!user) redirect(`/test-socket/${params.roomId}/view`)
  // fetch initial data for server rendering
  const url = `${PARTYKIT_URL}/parties/${party}/${params.roomId}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  const room = res.status === 404 ? null : await res.json();
  
  // fetch user session for server rendering

  return (
    <div className="w-full flex flex-col gap-4 justify-between items-start">
      <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2">
        <Link href="/chat" className="text-stone-400 whitespace-nowrap">
          &lt;- All Rooms
        </Link>
      </div>
      {room ? (
        <>
          <div className="w-full flex flex-row justify-between items-start pb-6">
            <div>
              <h1 className="text-4xl font-medium">{params.roomId}</h1>
            </div>
          </div>

          <TournamentDashboard
            host={PARTYKIT_HOST}
            party={party}
            user={user}
            room={params.roomId}
            messages={room.messages ?? []}
          />
        </>
      ) : (
        <h1 className="text-4xl font-medium">Room not found</h1>
      )}
    </div>
  );
}
