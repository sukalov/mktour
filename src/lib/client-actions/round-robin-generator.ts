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
  roundNumber: number;
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
  if (matchedEntities.length % 2 != 0)
    matchedEntities = getEvenSetOfPlayers(matchedEntities);

  // getting the bootstrap for the map, initially for all the players the pools are the same
  const initialEntitiesPools = getInitialEntitiesIdPairs(matchedEntities);
  const poolById: PoolById = new Map(initialEntitiesPools);

  const previousMatches = games.map((game) =>
    convertGameToEntitiesMatch(game, players),
  );

  const poolByIdUpdated = updateChessEntitiesMatches(poolById, previousMatches);

  // checking the pool for liveability
  poolById.forEach((entityPool, _) => {
    if (entityPool.size == 0)
      throw new EvalError(
        'Trying to generate a round without possible matches',
      );
  });

  // generating set of base matches
  const entitiesMatchingsGenerated = generateRoundRobinPairs(
    poolByIdUpdated,
    matchedEntities,
  );

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
  entityColourIndex: number;
  entityRating: number;
  gamesPlayed: number;
  entityNickname: string;
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
    entityColourIndex: playerModel.color_index,
    entityRating: playerModel.rating ?? 0, // If the player rating is null, we just use zero as a complement
    // Now we sum all the revious results to get the count of games
    gamesPlayed: playerModel.draws + playerModel.wins + playerModel.losses,
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
  console.log({ game, players, whitePlayer });
  console.log({ game, players, blackPlayer });
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
    whiteEntity.entityColourIndex > blackEntity.entityColourIndex ||
    (whiteEntity.entityColourIndex === blackEntity.entityColourIndex &&
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
  poolById: PoolById,
  matchedEntities: ChessTournamentEntity[],
) {
  const generatedPairs: EntitiesPair[] = [];

  // until the pool is not zero, we continue slicing it
  while (matchedEntities.length !== 0) {
    // it is guaranteed that it will be even, and thus we use a type guards here
    const firstEntity = matchedEntities.pop() as ChessTournamentEntity;

    // getting a set of possible matches, and then converting it to a list, to get a random entity
    const firstEntityPool = poolById.get(
      firstEntity.entityId,
    ) as PossibleMatches;

    // this shit is written because of how the set is working in js
    const possibleSecondEntities = Array.from(firstEntityPool.values());
    const secondEntity = possibleSecondEntities.pop() as ChessTournamentEntity;

    // removing matched entity from the matched list
    const secondEntityIndex = matchedEntities.indexOf(secondEntity);
    matchedEntities.splice(secondEntityIndex, 1);

    // removing matched entity from all other pools
    poolById.forEach((entityPool, _) => {
      entityPool.delete(firstEntity);
      entityPool.delete(secondEntity);
    });

    // generating a new pair
    const generatedPair: EntitiesPair = [firstEntity, secondEntity];
    generatedPairs.push(generatedPair);
  }

  return generatedPairs;
}

/**
 * This function gets the initial (or not) matched pools by id maps, which should show the possible opponent-entities for each entity
 * It also gets list of the previous matches, by which the possible remained matches are being recorded
 * It returns the pools without already matched pairs, dual sided -- chess style
 * @param poolById  map-like which is recording which player pair played already
 * @param previousMatches a list of previous matches
 * @returns the newly updated possible pool
 */
function updateChessEntitiesMatches(
  poolById: PoolById,
  previousMatches: NumberedEntitiesPair[],
) {
  // for every game we get the pair, and delete respective entry from each of the two pools of the possible
  // players
  previousMatches.forEach((previousMatch) => {
    const { whiteEntity, blackEntity } = previousMatch;

    // this is done so, because of the weird set object conversion
    const whitePool = poolById.get(whiteEntity.entityId);
    const blackPool = poolById.get(blackEntity.entityId);

    // updating
    whitePool?.forEach((matchedEntity) => {
      if (matchedEntity.entityId == blackEntity.entityId)
        whitePool.delete(matchedEntity);
    });
    blackPool?.forEach((matchedEntity) => {
      if (matchedEntity.entityId == whiteEntity.entityId)
        blackPool.delete(matchedEntity);
    });
  });

  return poolById;
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
