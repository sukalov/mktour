import {
  addExistingPlayer,
  addNewPlayer,
  getTournamentGames,
  getTournamentRoundGames,
  removePlayer,
  saveRound,
  setTournamentGameResult,
} from '@/lib/actions/tournament-managing';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema/clubs';
import { DatabasePlayer, players } from '@/lib/db/schema/players';
import {
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { protectedProcedure, publicProcedure } from '@/server/trpc';
import { PlayerModel } from '@/types/tournaments';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

export const tournamentRouter = {
  info: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const [tournamentInfo] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, input))
      .innerJoin(clubs, eq(tournaments.club_id, clubs.id));
    if (!tournamentInfo) throw new Error('TOURNAMENT NOT FOUND');
    return tournamentInfo;
  }),
  playersIn: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const playersDb = await db
      .select()
      .from(players_to_tournaments)
      .where(eq(players_to_tournaments.tournament_id, input))
      .innerJoin(players, eq(players.id, players_to_tournaments.player_id));

    const playerModels: PlayerModel[] = playersDb.map((each) => ({
      id: each.player.id,
      nickname: each.player.nickname,
      realname: each.player.realname,
      rating: each.player.rating,
      wins: each.players_to_tournaments.wins,
      draws: each.players_to_tournaments.draws,
      losses: each.players_to_tournaments.losses,
      color_index: each.players_to_tournaments.color_index,
      is_out: each.players_to_tournaments.is_out,
      place: each.players_to_tournaments.place,
    }));

    return playerModels.sort(
      (a, b) => b.wins + b.draws / 2 - (a.wins + a.draws / 2),
    );
  }),
  playersOut: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const result = (await db.all(sql`
      SELECT p.*
      FROM ${players} p
      LEFT JOIN ${players_to_tournaments} pt
        ON p.id = pt.player_id AND pt.tournament_id = ${input}
      WHERE p.club_id = (
        SELECT t.club_id
        FROM ${tournaments} t
        WHERE t.id = ${input}
      )
      AND pt.player_id IS NULL;
    `)) as Array<DatabasePlayer>;
    return result;
  }),
  roundGames: publicProcedure
    .input(
      z.object({
        tournamentId: z.string(),
        roundNumber: z.number(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;
      const result = await getTournamentRoundGames(input);
      return result;
    }),
  allGames: publicProcedure.input(z.string()).query(async (opts) => {
    const { input: tournamentId } = opts;
    const result = await getTournamentGames(tournamentId);
    return result;
  }),
  addExistingPlayer: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string(),
        player: z.object({
          id: z.string(),
          nickname: z.string(),
          realname: z.string().nullable(),
          rating: z.number(),
          club_id: z.string(),
        }),
        userId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await addExistingPlayer(input);
    }),
  addNewPlayer: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string(),
        player: z.object({
          id: z.string(),
          nickname: z.string(),
          realname: z.string().nullable(),
          rating: z.number(),
          club_id: z.string(),
        }),
        userId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await addNewPlayer(input);
    }),
  removePlayer: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string(),
        playerId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await removePlayer(input);
    }),
  setGameResult: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        whiteId: z.string(),
        blackId: z.string(),
        result: z.enum(['1-0', '0-1', '1/2-1/2']),
        prevResult: z.enum(['1-0', '0-1', '1/2-1/2']).nullable(),
        roundNumber: z.number(),
        userId: z.string(),
        tournamentId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await setTournamentGameResult(input);
    }),
  saveRound: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string(),
        roundNumber: z.number(),
        newGames: z.array(
          z.object({
            tournament_id: z.string(),
            id: z.string(),
            white_id: z.string(),
            black_id: z.string(),
            round_number: z.number(),
            game_number: z.number(),
            round_name: z
              .enum([
                'final',
                'match_for_third',
                'semifinal',
                'quarterfinal',
                '1/8',
                '1/16',
                '1/32',
                '1/64',
                '1/128',
              ])
              .nullable(),
            white_prev_game_id: z.string().nullable(),
            black_prev_game_id: z.string().nullable(),
            white_nickname: z.string(),
            black_nickname: z.string(),
            result: z.enum(['1-0', '0-1', '1/2-1/2']).nullable(),
          }),
        ),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await saveRound(input);
    }),
};
