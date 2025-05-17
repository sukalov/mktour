import { describe, expect, mock, test } from 'bun:test';

import {
  generateRoundRobinRound,
  RoundRobinRoundProps,
} from '@/lib/client-actions/round-robin-generator';
import { DatabaseUser } from '@/lib/db/schema/auth';
import { DatabaseClub, DatabaseTournament } from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { GameModel, PlayerModel, Result } from '@/types/tournaments';
import { faker } from '@faker-js/faker';
import assert from 'assert';

const INITIAL_WINS = 0;
const INITIAL_LOSSES = 0;
const INITIAL_DRAWS = 0;
const INITIAL_ONGOING_ROUND = 1;
const INITIAL_COLOUR_INDEX = 0;

const DEFAULT_PLACE = null;
const DEFAULT_IS_EXITED = false;
const DEFAULT_FORMAT = 'round robin';
const DEFAULT_TYPE = 'solo';

const POSSIBLE_RESULTS: Result[] = ['0-1', '1-0', '1/2-1/2'];

const RATING_FAKEOPTS = {
  min: 500,
  max: 3000,
};

const generateDatabasePlayer = mock<() => DatabaseUser>(() => {
  const randomId = newid();
  const randomNickname = faker.internet.username();
  const randomRealName = faker.person.fullName();
  const randomRating = faker.number.float(RATING_FAKEOPTS);
  const randomEmail = faker.internet.email();
  const randomClubName = faker.company.name();
  const randomCreationDate = faker.date.anytime();

  const randomUser: DatabaseUser = {
    id: randomId,
    username: randomNickname,
    name: randomRealName,
    email: randomEmail,
    rating: randomRating,
    selected_club: randomClubName,
    created_at: randomCreationDate,
  };
  return randomUser;
});

const generateRandomDatabaseClub = mock<() => DatabaseClub>(() => {
  const randomId = newid();
  const randomTitle = faker.animal.cat();
  const randomDescription = faker.food.description();
  const randomCreatedAt = faker.date.anytime();
  const randomLichessTeam = faker.book.title();
  const randomClub: DatabaseClub = {
    id: randomId,
    name: randomTitle,
    description: randomDescription,
    created_at: randomCreatedAt,
    lichess_team: randomLichessTeam,
  };
  return randomClub;
});

const generateRandomDatabaseTournament = mock<() => DatabaseTournament>(() => {
  const randomDate = faker.date.anytime();
  const randomId = newid();
  const randomTitle = faker.music.songName();
  const randomCreationDate = faker.date.anytime();
  const randomClub = generateRandomDatabaseClub();
  const randomStartDate = faker.date.anytime();
  const randomEndDate = faker.date.anytime();
  const randomRoundsNumber = faker.number.int();
  const randomIsRated = faker.datatype.boolean();

  const randomTournament: DatabaseTournament = {
    date: randomDate.toDateString(),
    id: randomId,
    title: randomTitle,
    format: DEFAULT_FORMAT,
    type: DEFAULT_TYPE,
    created_at: randomCreationDate,
    club_id: randomClub.id,
    started_at: randomStartDate,
    closed_at: randomEndDate,
    rounds_number: randomRoundsNumber,
    ongoing_round: INITIAL_ONGOING_ROUND,
    rated: randomIsRated,
  };

  return randomTournament;
});

const fillRandomResult = mock(
  /**
   * This function takes an array of games, and sets random results there
   * @param gameScheduled , a Game model with a null-result
   * @returns
   */
  (gameScheduled: GameModel) => {
    assert(
      gameScheduled.result === null,
      'A game result here should be null, or something went wrong!',
    );
    // selecting random result
    const randomGameResult = faker.helpers.arrayElement(POSSIBLE_RESULTS);
    gameScheduled.result = randomGameResult;
    return gameScheduled;
  },
);
const generatePlayerModel = mock(() => {
  const randomUser = generateDatabasePlayer();

  const randomPlayer: PlayerModel = {
    id: randomUser.id,
    nickname: randomUser.username,
    wins: INITIAL_WINS,
    draws: INITIAL_DRAWS,
    losses: INITIAL_LOSSES,
    color_index: INITIAL_COLOUR_INDEX,
    realname: randomUser.name,
    rating: randomUser.rating,
    exited: DEFAULT_IS_EXITED,
    place: DEFAULT_PLACE,
    pairingNumber: null,
  };

  return randomPlayer;
});

const PLAYER_NUMBER_FAKEOPTS = {
  min: 2,
  max: 1024,
};

const RANDOM_TOURNAMENTS_COUNT = 5;

describe('pure matching generation test', () => {
  for (
    let tournamentNumber = 0;
    tournamentNumber < RANDOM_TOURNAMENTS_COUNT;
    tournamentNumber++
  ) {
    // initialising the player number for the tournament
    const randomPlayerNumber = faker.number.int(PLAYER_NUMBER_FAKEOPTS);

    // initialising the player list
    const randomPlayers: PlayerModel[] = [];
    for (let playerIdx = 0; playerIdx < randomPlayerNumber; playerIdx++) {
      const generatedPlayer = generatePlayerModel();
      randomPlayers.push(generatedPlayer);
    }

    // simple pairing number rating assignment based on array index
    randomPlayers.forEach((matchedEntity, entityIndex) => {
      matchedEntity.pairingNumber = entityIndex;
    });
    // for the initial case, the previous games are missing
    const previousGames: GameModel[] = [];

    let currentRound = INITIAL_ONGOING_ROUND;

    const gameCount = (randomPlayerNumber / 2) * (randomPlayerNumber - 1);
    // random tournament initialised
    const randomTournament = generateRandomDatabaseTournament();

    while (previousGames.length < gameCount) {
      // generating round info formed
      const nextRoundRobinProps: RoundRobinRoundProps = {
        players: randomPlayers,
        games: previousGames,
        roundNumber: currentRound,
        tournamentId: randomTournament.id,
      };

      const gamesToInsert = generateRoundRobinRound(nextRoundRobinProps);

      // simulating round results
      gamesToInsert.forEach(fillRandomResult);

      previousGames.push(...gamesToInsert);
      currentRound++;
    }

    test(`${tournamentNumber} - game count equality to theoretical`, () => {
      // checking that the game count is equal to theoretical one
      const theoreticalGameCount =
        (randomPlayerNumber / 2) * (randomPlayerNumber - 1);
      expect(previousGames.length).toBe(theoreticalGameCount);
    });
  }
});
