'use client'
import { useTournamentStore } from "@/lib/hooks/use-tournament-store";

export default function TestOtherClientComponent(params:type) {
    const { possiblePlayers } = useTournamentStore()
    return <div>длина possiblePlayers: {possiblePlayers.length}</div>
}