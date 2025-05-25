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
type NumberPair = [number, number];

// classical shape of a round-generating function
export type RoundGenerator = (roundProps: RoundProps) => GameModel[];

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
    throw new TypeError(
      'No pairing happened to the player model; SOMETHING WENT WRONG',
    );
  const tournamentEntity: ChessTournamentEntity = {
    entityId: playerModel.id,
    entityNickname: playerModel.nickname,
    colourIndex: playerModel.color_index,
    entityRating: playerModel.rating ?? 0, // If the player rating is null, we just use zero as a complement
    // Now we sum all the revious results to get the count of games
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

  // adding the dummy index if odd player count
  if (dummyIndex) {
    pairingNumbersFlat.push(dummyIndex);
  }

  return pairingNumbersFlat;
}
