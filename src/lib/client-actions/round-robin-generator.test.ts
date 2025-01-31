import { expect, mock, test } from "bun:test";

import { newid } from "@/lib/utils";
import { PlayerModel } from "@/types/tournaments";
import { faker } from "@faker-js/faker";


const COLOUR_INDEX_FAKEOPTS = {
  min: -10,
  max: 10
}

const generatePlayerModel = mock(
  () => {
    const randomId = newid();
    const randomNickname = faker.internet.username();
    const randomWins = faker.number.int();
    const randomDraws = faker.number.int();
    const randomLosses = faker.number.int();
    const randomColourIndex = faker.number.int(COLOUR_INDEX_FAKEOPTS);
    const randomPlayer: PlayerModel = {
      id: randomId,
      nickname: randomNickname, 
      wins: randomWins,
      draws: randomDraws,
      losses: randomLosses,
      color_index: randomColourIndex
    }
    
    
  }
)

const randomName = faker.person.fullName();

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});

