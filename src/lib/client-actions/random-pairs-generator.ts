import { RoundGeneratorProps } from '@/lib/client-actions/common-generator';
import { GameModel } from '@/types/tournaments';

/**
 * This function generates random round by shuffling players and assembling them to pairs.
 * The only round function to operate on non-paired number players.
 */
export function generateRandomRoundGames(
  randomRoundProps: RoundGeneratorProps,
): GameModel[] {
  console.log(randomRoundProps);
  // checking if the set of layers is even, if not, making it even with a smart alg
  let matchedEntities = players.map(convertPlayerToEntity);

  console.log(matchedEntities, players, games, roundNumber, tournamentId);

  // generating set of base matches
  const entitiesMatchingsGenerated = generateRoundRobinPairs(
    matchedEntities,
    roundNumber,
  );
  // colouring the set of the matcthes
  const colouredMatches = entitiesMatchingsGenerated.map(getColouredPair);

  // numbering each match
  // 1 is added to start game numeration from 1 instead of 0
  const currentOffset = games.length + 1;
  const numberedMatches = colouredMatches.map(
    (colouredMatch, coulouredMatchIndex) =>
      getNumberedPair(colouredMatch, coulouredMatchIndex, currentOffset),
  );

  const gamesToInsert: GameModel[] = numberedMatches.map((numberedMatch) =>
    getGameToInsert(numberedMatch, tournamentId, roundNumber),
  );

  return gamesToInsert;
}
