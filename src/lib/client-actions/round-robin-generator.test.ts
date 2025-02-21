import { describe, mock } from "bun:test";

import { generateRoundRobinRoundFunction, RoundRobinRoundProps } from "@/lib/client-actions/round-robin-generator";
import { DatabaseUser } from "@/lib/db/schema/auth";
import { DatabaseClub, DatabaseTournament } from "@/lib/db/schema/tournaments";
import { newid } from "@/lib/utils";
import { GameModel, PlayerModel, Result } from "@/types/tournaments";
import { faker } from "@faker-js/faker";

const INITIAL_WINS = 0;
const INITIAL_LOSSES = 0;
const INITIAL_DRAWS = 0;
const INITIAL_ONGOING_ROUND = 0;
const INITIAL_COLOUR_INDEX = 0;


const DEFAULT_PLACE = null;
const DEFAULT_IS_EXITED = null;
const DEFAULT_FORMAT = "round robin";
const DEFAULT_TYPE = "solo";


const POSSIBLE_RESULTS = ["0-1", "1-0", "1/2-1/2"];

const COLOUR_INDEX_FAKEOPTS = {
  min: -10,
  max: 10
};

const RATING_FAKEOPTS = {
  min:500,
  max:3000
};

const generateDatabasePlayer = mock(
  () => {
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
      created_at: randomCreationDate
    };
    return randomUser;
  }
)


const generateRandomDatabaseClub = mock(
  () => {
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
      lichess_team: randomLichessTeam
    }
    return randomClub;
  }
)

const generateRandomDatabaseTournament = mock(
  () => {
    const randomDate = faker.date.anytime();
    const randomId = newid();
    const randomTitle = faker.music.songName();
    const randomCreationDate = faker.date.anytime();
    const randomClub = generateRandomDatabaseClub();
    const randomStartDate = faker.date.anytime();
    const randomEndDate = faker.date.anytime();
    const randomRoundsNumber = faker.number.int();
    const randomIsRated = faker.datatype.boolean();
    
    const randomTournament: DatabaseTournament =  {
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
      rated: randomIsRated
    }

    return randomTournament;
  }
)

const generatePlayerModel = mock(
  () => {
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
    }

    return randomPlayer; 
  }
)

const generateGameModel = mock(
 () => {
  const randomWhitePlayer = generatePlayerModel();
  const randomBlackPlayer = generatePlayerModel();
  
  const randomGameId = newid();

  const randomGame: GameModel = {
    black_nickname: randomBlackPlayer.nickname,
    white_nickname: randomWhitePlayer.nickname,
    id: "",
    game_number: 0,
    round_number: 0,
    round_name: null,
    white_id: "",
    black_id: "",
    white_prev_game_id: null,
    black_prev_game_id: null,
    result: null,
    tournament_id: ""
  };
 }
)
const PLAYER_NUMBER_FAKEOPTS = {
  min:6,
  max:6

};

describe("tournament generation test set", () => {


    // initialising the player number for the tournament
    const randomPlayerNumber = faker.number.int(PLAYER_NUMBER_FAKEOPTS);

    console.log(randomPlayerNumber)
    // initialising the player list
    const randomPlayers = [];
    for (let playerIdx = 0; playerIdx < randomPlayerNumber; playerIdx++) {
      const generatedPlayer = generatePlayerModel();
      randomPlayers.push(generatedPlayer);
    }

  
    // for the initial case, the previous games are missing
    let previousGames: GameModel[] = [];
 
    let currentRound = 0;

    const gameCount = randomPlayerNumber/ 2  *(randomPlayerNumber - 1)
    // random tournament initialised
    const randomTournament = generateRandomDatabaseTournament();

    while ( previousGames.length < gameCount) {
      // generating round info formed
      const nextRoundRobinProps: RoundRobinRoundProps = {
        players: randomPlayers,
        games: previousGames,
        roundNumber: currentRound,
        tournamentId: randomTournament.id
      };
      
      const gamesToInsert = generateRoundRobinRoundFunction(nextRoundRobinProps);
      
      // simulating round results
      for (const gameScheduled of gamesToInsert) {
        console.log(currentRound);
        
        // selecting random result
        const randomGameResult = faker.helpers.arrayElement(POSSIBLE_RESULTS) as Result;
        gameScheduled.result = randomGameResult;

        // updating info about the players in the tournament
        const blackPlayer = randomPlayers.find((player) => player.id === gameScheduled.black_id);
        const whitePlayer = randomPlayers.find((player) => player.id === gameScheduled.white_id);
        if (randomGameResult === "1-0") {
          blackPlayer!.losses += 1;
          whitePlayer!.wins +=1;
        } else if (randomGameResult === "0-1") {
          blackPlayer!.wins += 1;
          whitePlayer!.losses +=1;
        } else {
          blackPlayer!.draws +=1;
          whitePlayer!.draws +=1;
        }
      }

      previousGames.push(...gamesToInsert);
      currentRound++;
    }

    console.log(previousGames.length)
  })

