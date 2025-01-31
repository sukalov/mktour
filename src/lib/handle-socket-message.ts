'use client';
// ws-handler

import {
  DatabasePlayer,
  InsertDatabasePlayer,
} from '@/lib/db/schema/tournaments';
import { GameModel, PlayerModel, TournamentInfo } from '@/types/tournaments';
import type { Message } from '@/types/ws-events';
import { QueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const handleSocketMessage = (
  message: Message,
  queryClient: QueryClient,
  tournamentId: string,
  errorMessage: string,
  setRoundInView: Dispatch<SetStateAction<number>>,
) => {
  switch (message.type) {
    case 'add-new-player':
      queryClient.cancelQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
      queryClient.setQueryData(
        [tournamentId, 'players', 'added'],
        (cache: Array<PlayerModel> | undefined) => {
          if (cache) cache.concat(message.body);
        },
      );
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
      break;
    case 'add-existing-player':
      queryClient.cancelQueries({
        queryKey: [tournamentId, 'players'],
      });
      queryClient.setQueryData(
        [tournamentId, 'players', 'added'],
        (cache: Array<PlayerModel> | undefined) => {
          if (cache) cache.concat(message.body);
        },
      );
      queryClient.setQueryData(
        [tournamentId, 'players', 'possible'],
        (cache: Array<PlayerModel> | undefined) => {
          if (cache) cache.filter((pl) => pl.id !== message.body.id);
        },
      );
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players'],
      });
      break;
    case 'remove-player':
      queryClient.cancelQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
      const addedPlayers = queryClient.getQueryData([
        tournamentId,
        'players',
        'added',
      ]) as Array<PlayerModel>;
      if (!addedPlayers) break;
      const removedPlayer = addedPlayers.find(
        (player: PlayerModel) => player.id === message.id,
      );

      queryClient.setQueryData(
        [tournamentId, 'players', 'added'],
        (cache: Array<DatabasePlayer>) =>
          cache.filter((player) => player.id !== message.id),
      );
      if (removedPlayer) {
        const removedPlayerDb: InsertDatabasePlayer = {
          id: removedPlayer.id,
          nickname: removedPlayer.nickname,
          realname: removedPlayer.realname,
          rating: removedPlayer.rating,
          club_id: '',
          user_id: null,
        };
        queryClient.setQueryData(
          [tournamentId, 'players', 'possible'],
          (cache: Array<InsertDatabasePlayer>) => {
            if (cache) cache.concat(removedPlayerDb);
          },
        );
      }
      queryClient.invalidateQueries({ queryKey: [tournamentId, 'players'] });
      break;
    case 'set-game-result':
      queryClient.setQueryData(
        [tournamentId, 'games', { roundNumber: message.roundNumber }],
        (cache: Array<GameModel>) => {
          const index = cache.findIndex((obj) => obj.id == message.gameId);
          cache[index].result = message.result;
          return cache;
        },
      );
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games', { roundNumber: message.roundNumber }],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games', 'all'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
      break;
    case 'start-tournament':
      queryClient.setQueryData(
        [tournamentId, 'tournament'],
        (cache: TournamentInfo) => {
          cache.tournament.started_at = message.started_at;
          return cache;
        },
      );
    case 'reset-tournament':
      queryClient.setQueryData(
        [tournamentId, 'tournament'],
        (cache: TournamentInfo) => {
          cache.tournament.started_at = null;
          return cache;
        },
      );
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
      setRoundInView(1);
      break;
    case 'new-round':
      queryClient.setQueryData(
        [tournamentId, 'games', { roundNumber: message.roundNumber }],
        message.newGames,
      );
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games'],
      });
      message.isTournamentGoing &&
        queryClient.invalidateQueries({
          queryKey: [tournamentId, 'tournament'],
        });
      message.isTournamentGoing && setRoundInView(message.roundNumber);
      break;
    case 'error':
      toast.error(errorMessage, { id: 'wsErrorMessage' });
    default:
      break;
  }
};
