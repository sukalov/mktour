import { newid } from '@/lib/utils';
import { GameModel, PlayerModel } from '@/types/tournaments';

// default set of round properties, may be changed internally
export interface RoundProps {
  /**
   * Current round players
   */
  players: PlayerModel[];

  /**
   * Previously played games, not all round generators require those
   */
  games: GameModel[];

  /**
   * Current round played
   */
  roundNumber: number;

  /**
   * The maternal tournament
   */
  tournamentId: string;
}

// a special type for the number pairs, to enforce the two-foldness of the array
export type NumberPair = [number, number];

// classical shape of a round-generating function
export type RoundGenerator = (roundProps: RoundProps) => GameModel[];

// type of function which generates a set of pairs from initial pairing number list, and the current round info (optional)
export type PairsGenerator = (
  pairingNumbers: number[],
  roundNumber?: number,
) => NumberPair[];

/**
 * The type representing entities we are matching inside our algorithms
 * */
export interface ChessTournamentEntity {
  entityId: string;
  colourIndex: number;
  entityRating: number;
  gamesPlayed: number;
  entityNickname: string;
  pairingNumber: number;
}

/**
 * This interface is representing an entiies pair, which is already has colour in it
 */
interface ColouredEntitiesPair {
  whiteEntity: ChessTournamentEntity;
  blackEntity: ChessTournamentEntity;
}

interface NumberedEntitiesPair extends ColouredEntitiesPair {
  pairNumber: number;
}

/**
 * This is a generic type, which selects only unique properties of `Child`
 */
type OnlyChild<Child, Parent> = Omit<Child, keyof Parent>;

/**
 * First generated type of a round is just a pair of two entities
 */
export type EntitiesPair = [ChessTournamentEntity, ChessTournamentEntity];

/**
 * This simple converter is taking a joined player info and transforms it to a matched entity
 * @param playerModel a joined representation of player
 */
export function convertPlayerToEntity(playerModel: PlayerModel) {
  if (playerModel.pairingNumber === null)
    throw new TypeError('PAIRING_NUMBER_IS_NULL');

  const tournamentEntity: ChessTournamentEntity = {
    entityId: playerModel.id,
    entityNickname: playerModel.nickname,
    colourIndex: playerModel.color_index,
    entityRating: playerModel.rating,
    gamesPlayed: playerModel.draws + playerModel.wins + playerModel.losses,
    pairingNumber: playerModel.pairingNumber,
  };
  return tournamentEntity;
}

/**
 * This function by the finalized numbered match generates an entry for the drizzle database game
 * @param finalizedMatch finalized match, ready to be fed to the
 * @param tournamentId stringlike id of the tournament, needs to be in the game obj
 * @param roundNumber same motivation as for the tournament id, a number, showing what round a game will be played
 * @returns GameModel
 */
export function getGameToInsert(
  finalizedMatch: NumberedEntitiesPair,
  tournamentId: string,
  roundNumber: number,
): GameModel {
  // generating new id for the game
  const gameId = newid();

  // conversion to the game format
  const whiteId = finalizedMatch.whiteEntity.entityId;
  const blackId = finalizedMatch.blackEntity.entityId;

  const gameToInsert: GameModel = {
    id: gameId,
    white_id: whiteId,
    black_id: blackId,
    white_nickname: finalizedMatch.whiteEntity.entityNickname,
    black_nickname: finalizedMatch.blackEntity.entityNickname,
    tournament_id: tournamentId,
    round_number: roundNumber,
    game_number: finalizedMatch.pairNumber,
    // all those fields are set to null here, maybe will rethink that later
    round_name: null, // TODO: can be equal to round number in R&R
    white_prev_game_id: null, // TODO: fill the gaps in prev ids
    black_prev_game_id: null,
    result: null,
  };
  return gameToInsert;
}

/**
 * This function gets a coloured entities pair, and assigns them a provided number, judging by the offset.
 * @param colouredPair a coloured pair
 * @param pairNumber a number to number a pair with
 * @param offset an offset, which is being added to provided pair number
 */
export function getNumberedPair(
  colouredPair: ColouredEntitiesPair,
  pairNumber: number,
  offset: number,
): NumberedEntitiesPair {
  // getting the number offset of a current pair
  const pairNumberOffseted = pairNumber + offset;

  // constructing the additional properties of numbered pair
  const partialNumberedPair: OnlyChild<
    NumberedEntitiesPair,
    ColouredEntitiesPair
  > = { pairNumber: pairNumberOffseted };

  // merging coloured ones, and the new ones together
  const numberedPair: NumberedEntitiesPair = Object.assign(
    partialNumberedPair,
    colouredPair,
  );

  return numberedPair;
}

/**
 * This function gets a pair, and colours it according to the colour index
 * @param uncolouredPair the pair of two entities, array like
 * @returns a promise of a coloured pair object
 */
export function getColouredPair(
  uncolouredPair: EntitiesPair,
): ColouredEntitiesPair {
  let [whiteEntity, blackEntity] = uncolouredPair;

  // reversing the white and black, if the white colour index is bigger
  // (that means that current white has played more whites, than black player)
  // or if the colour is the same, then if the white rating is bigger, then we also reverse
  if (
    whiteEntity.colourIndex > blackEntity.colourIndex ||
    (whiteEntity.colourIndex === blackEntity.colourIndex &&
      whiteEntity.entityRating > blackEntity.entityRating)
  ) {
    [whiteEntity, blackEntity] = [blackEntity, whiteEntity];
  }
  const colouredPair: ColouredEntitiesPair = { whiteEntity, blackEntity };

  return colouredPair;
}

/**
 * This function takes a list of numbers, splits it in two halves and then creates a list of lists (where latter represent pairs)
 * @param pairSubstrate flat array like object, which consists of the objects which should be translated to pairs
 * @param isCycle this flag optionally reverses the second half, making it a cycle-like pair creation. By default it is matrix like.
 * @returns a list of pairs
 */
export function makeNumberPairs(
  pairSubstrate: number[],
  isCycle = false,
): NumberPair[] {
  // checking if the array is splittable
  if (pairSubstrate.length % 2 != 0)
    throw Error('THIS FUNCTION SUPPORTS ONLY EVENLY SIZED ARRAYS');

  // splitting the array to two halves
  const separationIdx = Math.ceil(pairSubstrate.length / 2);
  const firstElements = pairSubstrate.slice(0, separationIdx);
  const secondElements = pairSubstrate.slice(separationIdx);

  // this optionally makes it cycle-like (0 element will be paired with the N-th)
  if (isCycle) secondElements.reverse();

  // converting those two arrays to the list of pairs
  const pairList = firstElements.map((firstElement, pairNumber) => {
    const secondElement = secondElements[pairNumber];
    const generatedNumberPair: NumberPair = [firstElement, secondElement];
    return generatedNumberPair;
  });

  return pairList;
}

/**
 * This is a helper function, which creates a hashmap for the number - entity relations
 * @param matchedEntities a list-like of entities to match
 * @returns a map-like object of entities linked to their respective pair numbers
 */
export function constructEntityByPairingNumber(
  matchedEntities: ChessTournamentEntity[],
) {
  const entityByPairingNumber = new Map<number, ChessTournamentEntity>();

  // filling the map iterating through entities
  matchedEntities.forEach((chessEntity) => {
    const pairingNumber = chessEntity.pairingNumber;
    entityByPairingNumber.set(pairingNumber, chessEntity);
  });

  return entityByPairingNumber;
}

/**
 * This function gets length of the entities array, and generates the array of pairing numbers, representing those entities
 * @param entitiesNumber
 * @returns
 */
export function generatePairingNumbers(entitiesNumber: number) {
  // generating an initial number array, a flat collection of numbers from 0 to n-1 (where n is number of players)
  const initialPairingEmpty = Array(entitiesNumber);
  const pairingNumbersFlat = Array.from(initialPairingEmpty.keys());

  return pairingNumbersFlat;
}

/**
 * This function takes an entities pool and constructs a next round of games, by any chosen method
 *
 * @param matchedEntities a list like of all the players, converted to the entities already
 * @param roundNumber for correct analysis of the current circle shift, we pass a round number parpmeter
 *
 *
 */
export function generateRoundPairs(
  matchedEntities: ChessTournamentEntity[],
  roundNumber: number,
  generatePairs: PairsGenerator,
) {
  // an empty array for a future generated pair
  const generatedPairs: EntitiesPair[] = [];

  // creating a helper map, which is returning entity by its pairing number
  const entityByPairingNumber = constructEntityByPairingNumber(matchedEntities);

  // constructing dummy index, which is null if the array of entities is even, and is equal to length otehrwise
  let dummyIndex = null;
  if (matchedEntities.length % 2 !== 0) dummyIndex = matchedEntities.length;

  // generating a list of pairing numbers, with an  optional dummy index inside
  const pairingNumbersFlat = generatePairingNumbers(matchedEntities.length);

  // adding the dummy index if it exists
  if (dummyIndex) {
    pairingNumbersFlat.push(dummyIndex);
  }

  // actual pair forming process
  let pairedPlayerNumbers = generatePairs(pairingNumbersFlat, roundNumber);

  // again, if the array is odd, we remove the pair with the dummy index inside
  if (dummyIndex)
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
