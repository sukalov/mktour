import { newid } from '@/lib/utils';
import { GameModel, PlayerModel } from '@/types/tournaments';


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


  // if this is first round, assign unique indices to the players based on rating ranking
  if (roundNumber == 0) {
    // sorting the matched entities by the rating difference, namely rating-descending order
    matchedEntities.sort((leftPlayer, rightPlayer) => leftPlayer.entityRating - rightPlayer.entityRating);

    // simple pairing number rating assignment based on array index
    matchedEntities.forEach((matchedEntity, entityIndex) => {
      matchedEntity.pairingNumber = entityIndex;
    });
  }

  
  // generating set of base matches
  const entitiesMatchingsGenerated = generateRoundRobinPairs(
    poolByIdUpdated,
    matchedEntities,
  );

  console.log(entitiesMatchingsGenerated);
  // colouring the set of the matcthes
  const colouredMatches = entitiesMatchingsGenerated.map(getColouredPair);

  // numbering each match
  // 1 is added to start game numeration from 1 instead of 0
  const currentOffset = previousMatches.length + 1;
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
  pairingNumber: number | null;
}

/**
 * This is a set of a possible opponents, by entities' ids
 */
type PossibleMatches = Set<ChessTournamentEntity>;

/**
 * This type is representing the bootstrapping material for the map of possible player pools
 */
type EntityIdPoolPair = [ChessTournamentEntity['entityId'], PossibleMatches];

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
type EntitiesPair = [ChessTournamentEntity, ChessTournamentEntity];

/**
 * This is a map-like which maps every entity id to a set of possible matches for it
 */
type PoolById = Map<ChessTournamentEntity['entityId'], PossibleMatches>;

/**
 * This function gets a list of entities, and populates it as a list of pairs of entity id, to the whole list excluding this entity.
 * This is done to have a bootstrap for mapping entities to the possible opponents for the round.
 * @param matchedEntities list with entities-like objects
 * @returns initialEntitiesIdPairs
 */
function getInitialEntitiesIdPairs(matchedEntities: ChessTournamentEntity[]) {
  // initializing a bootstrapping array
  const initialEntitiesIdPoolPairs: EntityIdPoolPair[] = [];

  // filling the bootstrapping array here
  matchedEntities.forEach(
    /**
     * This function is taking the matched entity, forms a copy of a big set of players, then removes the current entity from a
     * pool. Then it just forms a pair of values (this is a map bootstrap, remember?) and updates the outer array
     * @param matchedEntity
     */
    (matchedEntity: ChessTournamentEntity) => {
      const matchedEntitiesPool = new Set(matchedEntities);
      matchedEntitiesPool.delete(matchedEntity);

      const poolIdPair: EntityIdPoolPair = [
        matchedEntity.entityId,
        matchedEntitiesPool,
      ];

      initialEntitiesIdPoolPairs.push(poolIdPair);
    },
  );

  return initialEntitiesIdPoolPairs;
}

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
    pairingNumber: playerModel.pairingNumber ?? null
  };
  return tournamentEntity;
}

/**
 * This function takes drizzle specific large join, containing detailed game information of both the game
 * and the players set, then it converts it to the match in the match database.
 * @param databaseDetailedGame collection of objects related to database game
 * @returns the numbered pair, the final tye of matched entities
 */
function convertGameToEntitiesMatch(
  game: GameModel,
  players: Array<PlayerModel>,
): NumberedEntitiesPair {
  const whitePlayer = players.find((person) => person.id === game.white_id);
  const blackPlayer = players.find((person) => person.id === game.black_id);

  if (!whitePlayer || !blackPlayer)
    throw new Error('the set of games seems to not match the set of players');

  const whiteEntity = convertPlayerToEntity(whitePlayer);
  const blackEntity = convertPlayerToEntity(blackPlayer);

  // putting everything together
  const entitiesMatch: NumberedEntitiesPair = {
    whiteEntity,
    blackEntity,
    pairNumber: game.game_number,
  };
  return entitiesMatch;
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
 * This function takes an entities pool constructs a list of possible pairs of those
 * @param poolById always EVEN set of players
 */

function generateRoundRobinPairs(
  matchedEntities: ChessTournamentEntity[],
  roundNumber: number
) {
  const generatedPairs: EntitiesPair[] = [];


  const entityByPairingNumber = new Map<number, ChessTournamentEntity>;

  matchedEntities.forEach(
    (chessEntity) => {
      const pairingNumber = chessEntity.pairingNumber as number;
      entityByPairingNumber.set(pairingNumber, chessEntity);
    }
  )



  const initialPairingEmpty = Array(matchedEntities.length);
  const pairingNumbersFlat = Array.from(initialPairingEmpty.keys());

  const constantPairingNumber = pairingNumbersFlat.shift() as number;

  for (let cycleNumber = 0; cycleNumber< roundNumber; cycleNumber++) {
    const lastPairingNumber = pairingNumbersFlat.shift() as number;
    pairingNumbersFlat.push(lastPairingNumber);
  }

  pairingNumbersFlat.unshift(constantPairingNumber);

  const pairedNumbers = pairingNumbersFlat.reduce(
    (pairedNumbers: number[][], currentValue, currentIndex, flatNumbers) => {
      if (currentIndex%2 == 0){
        const newPairing = [currentValue];
        pairedNumbers.push(newPairing);
      } else {
        const previousPairing = pairedNumbers[pairedNumbers.length];
        previousPairing.push(currentValue);
      }
      return pairedNumbers;
    },
    []
  );

  const pairedPlayers = pairedNumbers.map(
    (numberPair) => {
      return numberPair.map(
        (entityNumber) => entityByPairingNumber.get(entityNumber) as ChessTournamentEntity
      )
    }
  )




  // generating a new pair
  const generatedPair: EntitiesPair = [firstEntity, secondEntity];
  generatedPairs.push(generatedPair);
  }
  return generatedPairs;
}



/**
 * This function gets uneven set of alyers guaranteed, and excludes alyer with the most games
 * @param matchedEntities list like of entities with info about games
 * @returns matched entities list but even
 */
function getEvenSetOfPlayers(matchedEntities: ChessTournamentEntity[]) {
  const gamesCounts = matchedEntities.map(
    (matchedEntity) => matchedEntity.gamesPlayed,
  );
  const maxGameCount = Math.max(...gamesCounts);
  const playerIndexToExclude = matchedEntities.findIndex(
    (matchedEntity) => matchedEntity.gamesPlayed === maxGameCount,
  );
  matchedEntities.splice(playerIndexToExclude, 1);
  return matchedEntities;
}
