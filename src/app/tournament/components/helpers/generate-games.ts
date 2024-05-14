'use client';

import {
  DashboardContextType,
  Round,
} from '@/app/tournament/[id]/dashboard-context';
import { DatabasePlayerToTournament } from '@/lib/db/schema/tournaments';
import { Result } from '@/types/tournaments';

const generateGames = (players: DashboardContextType['players']): any => {
  const games: DashboardContextType['games'] = [];
  const results = generateResults(players);
  const totalPlayers = players.length;
  let resultIndex = 0;

  // Initialize player stats
  const playerStats: {
    [playerId: string]: { wins: number; losses: number; draws: number };
  } = {};
  players.forEach((player) => {
    playerStats[player.player_id] = { wins: 0, losses: 0, draws: 0 };
  });

  // Generate games for each round
  for (let roundNum = 0; roundNum < totalPlayers - 1; roundNum++) {
    const round: Round = [];

    // Pair up players for this round
    for (let i = 0; i < totalPlayers / 2; i++) {
      const player1 = players[i];
      const player2 = players[totalPlayers - 1 - i];
      const result = results[resultIndex];

      // Update player stats based on game result
      if (result === '1-0') {
        playerStats[player1.player_id].wins++;
        playerStats[player2.player_id].losses++;
      } else if (result === '0-1') {
        playerStats[player1.player_id].losses++;
        playerStats[player2.player_id].wins++;
      } else {
        playerStats[player1.player_id].draws++;
        playerStats[player2.player_id].draws++;
      }

      // Create game between player1 and player2 with pre-generated result
      const game = {
        id: `game_${roundNum}_${i}`, // Unique ID for the game
        tournament_id: '', // Set based on your application logic
        round_number: roundNum + 1,
        round_name: null,
        white_id: player1.player_id,
        black_id: player2.player_id,
        result: result,
        white_nickname: player1.nickname || '',
        black_nickname: player2.nickname || '',
        white_prev_game_id: null,
        black_prev_game_id: null
      };

      round.push(game);
      resultIndex++;
    }

    games.push(round); // Push the round into the games array
  }

  // Update players array with stats
  const updatedPlayers = players.map((player) => ({
    ...player,
    wins: playerStats[player.player_id].wins,
    losses: playerStats[player.player_id].losses,
    draws: playerStats[player.player_id].draws,
  }));

  return { games, updatedPlayers };
};

function generateResults(players: DatabasePlayerToTournament[]): Result[] {
  const totalPlayers = players.length;
  const numGames = (totalPlayers * (totalPlayers - 1)) / 2;
  const results: Result[] = [];
  for (let i = 0; i < numGames; i++) {
    const randomResult = Math.random();
    if (randomResult < 1 / 3) {
      results.push('0-1');
    } else if (randomResult < 2 / 3) {
      results.push('1-0');
    } else {
      results.push('1/2-1/2');
    }
  }
  return results;
}

export default generateGames;
