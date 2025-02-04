import { expect, mock, test } from "bun:test";

import { DatabaseUser } from "@/lib/db/schema/auth";
import { DatabaseClub, DatabaseTournament } from "@/lib/db/schema/tournaments";
import { newid } from "@/lib/utils";
import { PlayerModel } from "@/types/tournaments";
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



test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});

