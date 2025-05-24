import {
  ChessTournamentEntity,
  convertPlayerToEntity,
  EntitiesPair,
  getColouredPair,
  getGameToInsert,
  getNumberedPair,
  RoundProps,
} from '@/lib/client-actions/common-generator';
import { GameModel } from '@/types/tournaments';

/**
 * This function generates random round by shuffling players and assembling them to pairs.
 * The only round function to operate on non-paired number players.
 */
export function generateRandomRoundGames(
  randomRoundProps: RoundProps,
): GameModel[] {
  // checking if the set of layers is even, if not, making it even with a smart alg
  const matchedEntities = randomRoundProps.players.map(convertPlayerToEntity);

  // generating set of base matches
  const entitiesMatchingsGenerated = generateRandomRoundPairs(matchedEntities);
  // colouring the set of the matcthes
  const colouredMatches = entitiesMatchingsGenerated.map(getColouredPair);

  // numbering each match
  // 1 is added to start game numeration from 1 instead of 0
  const currentOffset = randomRoundProps.games.length + 1;
  const numberedMatches = colouredMatches.map(
    (colouredMatch, coulouredMatchIndex) =>
      getNumberedPair(colouredMatch, coulouredMatchIndex, currentOffset),
  );

  const gamesToInsert: GameModel[] = numberedMatches.map((numberedMatch) =>
    getGameToInsert(
      numberedMatch,
      randomRoundProps.tournamentId,
      randomRoundProps.roundNumber,
    ),
  );

  return gamesToInsert;
}

function generateRandomRoundPairs(
  matchedEntities: ChessTournamentEntity[],
): EntitiesPair[] {
  console.log(matchedEntities);
  throw Error('THIS FUNCTIONALITY IS NOT IMPLEMENTED!');
}
