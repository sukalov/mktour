import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import {
  GameModel,
  GameProps,
  PlayerModel,
  Result,
  type Format,
} from '@/types/tournaments';

export class Player implements PlayerModel {
  name: string;
  rating?: number;
  wins: number = 0;
  draws: number = 0;
  losses: number = 0;
  colorIndex: number = 0;

  constructor(props: DatabasePlayer) {
    this.name = props?.nickname ?? '';
    this.rating = props?.rating ?? 1500;
  }
}

export class Game implements GameModel {
  black: Player;
  white: Player;
  round: number;
  result: Result;
  num: number;

  constructor(props: GameProps) {
    this.black = props.black;
    this.white = props.white;
    this.round = props.round;
    this.result = undefined;
    this.num = props.num;
  }

  setResult(result: Result) {
    if (!this.result) {
      this.result = result;
      switch (result) {
        case '1-0':
        case this.white.name:
          this.white.wins += 1;
          this.black.losses += 1;
          break;
        case '0-1':
        case this.black.name:
          this.black.wins += 1;
          this.white.losses += 1;
          break;
        case '1/2-1/2':
          this.black.draws += 1;
          this.white.draws += 1;
          break;
        default:
          console.log('game result cannot be saved');
      }
    }
  }

  abortResult() {
    if (this.result) {
      switch (this.result) {
        case '1-0':
        case this.white.name:
          this.white.wins -= 1;
          this.black.losses -= 1;
          break;
        case '0-1':
        case this.black.name:
          this.black.wins -= 1;
          this.white.losses -= 1;
          break;
        case '1/2-1/2':
          this.black.draws -= 1;
          this.white.draws -= 1;
          break;
        default:
          console.log('game result cannot be aborted');
      }
      this.result = undefined;
    }
  }
}

export class Tournament {
  players: Player[];
  format: Format;
  constructor(format: Format) {
    this.players = [];
    this.format = format;
  }
  addPlayer(player: Player) {
    this.players.push(player);
  }

  shuffle() {
    let m = this.players.length,
      t: Player,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = this.players[m];
      this.players[m] = this.players[i];
      this.players[i] = t;
    }
  }
}
