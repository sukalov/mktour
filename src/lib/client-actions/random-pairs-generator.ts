import {
  convertPlayerToEntity,
  generateRoundPairs,
  getColouredPair,
  getGameToInsert,
  getNumberedPair,
  RoundProps,
} from '@/lib/client-actions/common-generator';
import { shuffle } from '@/lib/utils';
import { GameModel } from '@/types/tournaments';

/**
 * This function generates random round by shuffling players and assembling them to pairs.
 * The only round function to operate on non-paired number players.
 * #TODO: remove, and unify the generation routines in the commons
 */
export function generateRandomRoundGames(
  randomRoundProps: RoundProps,
): GameModel[] {
  // checking if the set of layers is even, if not, making it even with a smart alg
  const matchedEntities = randomRoundProps.players.map(convertPlayerToEntity);

  // generating set of base matches
  const entitiesMatchingsGenerated = generateRoundPairs(
    matchedEntities,
    randomRoundProps.roundNumber,
    generateRandomPairs,
  );

  // colouring the set of the matcthes
  const colouredMatches = entitiesMatchingsGenerated.map(getColouredPair);

  // numbering each match
  // 1 is added to start game numeration from 1 instead of 0
  const currentOffset = randomRoundProps.games.length + 1;
  const numberedMatches = colouredMatches.map(
    (colouredMatch, coulouredMatchIndex) =>
      getNumberedPair(colouredMatch, coulouredMatchIndex, currentOffset),
  );

  // matching the games to the game models
  const gamesToInsert: GameModel[] = numberedMatches.map((numberedMatch) =>
    getGameToInsert(
      numberedMatch,
      randomRoundProps.tournamentId,
      randomRoundProps.roundNumber,
    ),
  );

  return gamesToInsert;
}

/**
 * This function essentially provides a random pairing layout
 * @param pairingNumbersFlat  a listlike with the pairing number
 * @returns
 */
function generateRandomPairs(pairingNumbersFlat: number[]) {
  // creating an essentially random pairing order
  const randomPairingNumbers = shuffle(pairingNumbersFlat);
  return randomPairingNumbers;
}
