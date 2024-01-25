export interface GameProps {
    white: PlayerModel;
    black: PlayerModel;
    round: number;
    num: number;
}

export interface PlayerModel {
    name: string;
    rating?: number;
    wins: number;
    draws: number;
    losses: number;
    colorIndex: number;
}

export interface GameModel {
    black: PlayerModel;
    white: PlayerModel;
    round: number;
    result: '0-1' | '1-0' | '1/2-1/2' | undefined;
    num: number;
}

type Result = '0-1' | '1-0' | '1/2-1/2' | undefined;

export type Format = 'swiss' | 'round robin' | 'double elimination'