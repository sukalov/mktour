import {
  GameType,
  GamesArray,
  Player,
  Round,
} from '@/app/tournament/[id]/tournament-context';

function generateGames(players: Player[]): GamesArray {
  const games: GamesArray = [];
  const results = generateResults(players);
  const totalPlayers = players.length;
  let resultIndex = 0;

  // Generate games for each round
  for (let roundNum = 0; roundNum < totalPlayers - 1; roundNum++) {
    const round: Round = [];

    // Pair up players for this round
    for (let i = 0; i < totalPlayers / 2; i++) {
      const player1 = players[i];
      const player2 = players[totalPlayers - 1 - i];

      // Create game between player1 and player2 with pre-generated result
      const game: GameType = {
        players: [player1, player2],
        result: results[resultIndex],
      };

      round.push(game);
      resultIndex++;
    }

    // Rotate players for the next round
    players.splice(1, 0, players.pop()!);
    games.push(round);
  }

  return games;
}

function generateResults(players: Player[]): number[] {
  const totalPlayers = players.length;
  const numGames = (totalPlayers * (totalPlayers - 1)) / 2;
  const results: number[] = [];
  for (let i = 0; i < numGames; i++) {
    results.push(Math.floor(Math.random() * 3) - 1);
  }
  return results;
}


export default generateGames;
