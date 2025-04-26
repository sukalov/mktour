import { newid } from '@/lib/utils';
import { GameModel, PlayerModel } from '@/types/tournaments';

const INITIAL_ROUND_NUMBER = 1;

export interface RoundRobinRoundProps {
  /**
   * Current round players
   */
  players: PlayerModel[];

  /**
   * Previously played games
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
};

/**
 * This function purposefully generates the bracket round for the round robin tournament. It gets the
 * tournamentId, checks the query for the current list of players, and  gets the games played by them.
 * By using that information, it returns the new games list, which are then published to the respective
 * ws.
 */

export function generateRoundRobinRoundFunction({
  players,
  games,
  roundNumber,
  tournamentId,
}: RoundRobinRoundProps): GameModel[] {
  games = games?.filter((game) => game.round_number !== roundNumber) ?? [];

  // checking if the set of layers is even, if not, making it even with a smart alg
  let matchedEntities = players.map(convertPlayerToEntity);

  console.log(matchedEntities, players, games, roundNumber, tournamentId);
  
  // generating set of base matches
  const entitiesMatchingsGenerated = generateRoundRobinPairs(
    matchedEntities, roundNumber
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
 * The type representing entities we are matching inside our algorithms
 * */
interface ChessTournamentEntity {
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


type EntitiesNumberPair = [number, number];

/**
 * First generated type of a round is just a pair of two entities
 */
type EntitiesPair = [ChessTournamentEntity, ChessTournamentEntity];



/**
 * This simple converter is taking a joined player info and transforms it to a matched entity
 * @param playerModel a joined representation of player
 */
function convertPlayerToEntity(playerModel: PlayerModel) {
  const tournamentEntity: ChessTournamentEntity = {
    entityId: playerModel.id,
    entityNickname: playerModel.nickname,
    colourIndex: playerModel.color_index,
    entityRating: playerModel.rating ?? 0, // If the player rating is null, we just use zero as a complement
    // Now we sum all the revious results to get the count of games
    gamesPlayed: playerModel.draws + playerModel.wins + playerModel.losses,
    pairingNumber: playerModel.pairingNumber
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
function getGameToInsert(
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
function getNumberedPair(
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
function getColouredPair(uncolouredPair: EntitiesPair): ColouredEntitiesPair {
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
 * This function takes an entities pool and constructs a next round of games, by the circle method
 * 
 * @param matchedEntities a list like of all the players, converted to the entities already
 * @param roundNumber for correct analysis of the current circle shift, we pass a round number parpmeter
 * 
 * 
 */
function generateRoundRobinPairs(
  matchedEntities: ChessTournamentEntity[],
  roundNumber: number
) {
  // an empty array for a future generated pair
  const generatedPairs: EntitiesPair[] = [];


  // creating a helper map, which is returning entity by its pairing number

  const entityByPairingNumber = new Map<number, ChessTournamentEntity>;

  matchedEntities.forEach(
    (chessEntity) => {
      const pairingNumber = chessEntity.pairingNumber;
      entityByPairingNumber.set(pairingNumber, chessEntity);
    }
  )

  // this is used, if the length of players is odd, marking the non-matched player
  // it is not in if block for simplifying the work for the typescript (otherwise we would need to check the thing twice)
  const dummyIndex = matchedEntities.length;

  // generating an initial number array, a flat collection of numbers from 0 to n-1 (where n is number of players)
  const initialPairingEmpty = Array(matchedEntities.length);
  const pairingNumbersFlat = Array.from(initialPairingEmpty.keys());


  // adding the dummy index if odd player count
  if (matchedEntities.length %2 !== 0)
    pairingNumbersFlat.push(dummyIndex);

  // starting shifting process (cycling the circle of players, having one number fixed)
  const constantPairingNumber = pairingNumbersFlat.shift() as number;

  // cycling process, where you just rotate the array
  for (let cycleNumber = INITIAL_ROUND_NUMBER; cycleNumber< roundNumber; cycleNumber++) {
    const lastPairingNumber = pairingNumbersFlat.shift() as number;
    pairingNumbersFlat.push(lastPairingNumber);
  }

  // adding the first player, which is always fixed
  pairingNumbersFlat.unshift(constantPairingNumber);

  // splitting the array, and matching the reverse of the second part with the first part, making a proper circle
  const numberOfPairs = Math.ceil(pairingNumbersFlat.length / 2)
  const firstPlayers = pairingNumbersFlat.slice(0, numberOfPairs);
  const secondPlayers = pairingNumbersFlat.slice(numberOfPairs);
  secondPlayers.reverse();


  // converting those two arrays to the list of playre matching number pairs
  let pairedPlayerNumbers = firstPlayers.map(
    (firstPlayer, pairNumber) => {
      const secondPlayer = secondPlayers[pairNumber];
      const generatedNumberPair: EntitiesNumberPair = [firstPlayer, secondPlayer];
      return generatedNumberPair;
    }
  )

  // again, if the array is odd, we remove the pair with the dummy index inside
  if (matchedEntities.length %2 !==0)
    pairedPlayerNumbers = pairedPlayerNumbers.filter(
    (numberPair) => !numberPair.includes(dummyIndex)
    )
  

  // final mapping of the player numbers to the players together
  for (let numberPair of pairedPlayerNumbers){
    const entitiesPair = numberPair.map(
      (numberPair) => entityByPairingNumber.get(numberPair) as ChessTournamentEntity
    ) as EntitiesPair
    generatedPairs.push(entitiesPair);
  }
  return generatedPairs;
}


