import {
  ChessTournamentEntity,
  constructEntityByPairingNumber,
  convertPlayerToEntity,
  EntitiesPair,
  getColouredPair,
  getGameToInsert,
  getNumberedPair,
  makeNumberPairs,
  RoundProps,
} from '@/lib/client-actions/common-generator';
import { GameModel } from '@/types/tournaments';

const INITIAL_ROUND_NUMBER = 1;

/**
 * This function purposefully generates the bracket round for the round robin tournament. It gets the
 * tournamentId, checks the query for the current list of players, and  gets the games played by them.
 * By using that information, it returns the new games list, which are then published to the respective
 * ws.
 */

export function generateRoundRobinRound({
  players,
  games,
  roundNumber,
  tournamentId,
}: RoundProps): GameModel[] {
  games = games?.filter((game) => game.round_number !== roundNumber) ?? [];

  // checking if the set of layers is even, if not, making it even with a smart alg
  const matchedEntities = players.map(convertPlayerToEntity);

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

/**
 * This function takes an entities pool and constructs a next round of games, by the circle method
 *
 * @param matchedEntities a list like of all the players, converted to the entities already
 * @param roundNumber for correct analysis of the current circle shift, we pass a round number parpmeter
 *
 *
 */
function generateRoundRobinPairs(
  matchedEntities: ChessTournamentEntity[],
  roundNumber: number,
) {
  // an empty array for a future generated pair
  const generatedPairs: EntitiesPair[] = [];

  // creating a helper map, which is returning entity by its pairing number
  const entityByPairingNumber = constructEntityByPairingNumber(matchedEntities);

  // this is used, if the length of players is odd, marking the non-matched player
  // it is not in if block for simplifying the work for the typescript (otherwise we would need to check the thing twice)
  const dummyIndex = matchedEntities.length;

  // generating an initial number array, a flat collection of numbers from 0 to n-1 (where n is number of players)
  const initialPairingEmpty = Array(matchedEntities.length);
  const pairingNumbersFlat = Array.from(initialPairingEmpty.keys());

  // adding the dummy index if odd player count
  if (matchedEntities.length % 2 !== 0) pairingNumbersFlat.push(dummyIndex);

  // starting shifting process (cycling the circle of players, having one number fixed)
  const constantPairingNumber = pairingNumbersFlat.shift() as number;

  // cycling process, where you just rotate the array
  for (
    let cycleNumber = INITIAL_ROUND_NUMBER;
    cycleNumber < roundNumber;
    cycleNumber++
  ) {
    const lastPairingNumber = pairingNumbersFlat.shift() as number;
    pairingNumbersFlat.push(lastPairingNumber);
  }

  // adding the first player, which is always fixed
  pairingNumbersFlat.unshift(constantPairingNumber);

  // generating pair of player numbers in a cyclic fashion
  let pairedPlayerNumbers = makeNumberPairs(pairingNumbersFlat, true);

  // again, if the array is odd, we remove the pair with the dummy index inside
  if (matchedEntities.length % 2 !== 0)
    pairedPlayerNumbers = pairedPlayerNumbers.filter(
      (numberPair) => !numberPair.includes(dummyIndex),
    );

  // final mapping of the player numbers to the players together
  for (const numberPair of pairedPlayerNumbers) {
    const entitiesPair = numberPair.map(
      (numberPair) =>
        entityByPairingNumber.get(numberPair) as ChessTournamentEntity,
    ) as EntitiesPair;
    generatedPairs.push(entitiesPair);
  }
  return generatedPairs;
}
