'use client';
// ws-handler

import { useTRPC } from '@/components/trpc/client';
import { DatabasePlayer } from '@/lib/db/schema/players';
import { PlayerModel } from '@/types/tournaments';
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
  trpc: ReturnType<typeof useTRPC>,
) => {
  switch (message.type) {
    case 'add-new-player':
      queryClient.cancelQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      queryClient.setQueryData(
        trpc.tournament.playersIn.queryKey({ tournamentId }),
        (cache) => {
          if (cache) return cache.concat(message.body);
        },
      );
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      break;
    case 'add-existing-player':
      queryClient.cancelQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      queryClient.cancelQueries({
        queryKey: trpc.tournament.playersOut.queryKey({ tournamentId }),
      });
      queryClient.setQueryData(
        trpc.tournament.playersIn.queryKey({ tournamentId }),
        (cache) => {
          if (cache) return cache.concat(message.body);
        },
      );
      queryClient.setQueryData(
        trpc.tournament.playersOut.queryKey({ tournamentId }),
        (cache) => {
          if (cache) return cache.filter((pl) => pl.id !== message.body.id);
        },
      );
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersOut.queryKey({ tournamentId }),
      });
      break;
    case 'remove-player':
      queryClient.cancelQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      const addedPlayers = queryClient.getQueryData(
        trpc.tournament.playersIn.queryKey({ tournamentId }),
      );
      if (!addedPlayers) break;
      const removedPlayer = addedPlayers.find(
        (player: PlayerModel) => player.id === message.id,
      );

      queryClient.setQueryData(
        trpc.tournament.playersIn.queryKey({ tournamentId }),
        (cache) => cache && cache.filter((player) => player.id !== message.id),
      );
      if (removedPlayer) {
        const removedPlayerDb: DatabasePlayer = {
          id: removedPlayer.id,
          nickname: removedPlayer.nickname,
          realname: removedPlayer.realname ?? null,
          rating: removedPlayer.rating,
          club_id: '',
          user_id: null,
          last_seen: null,
        };
        queryClient.setQueryData(
          trpc.tournament.playersOut.queryKey({ tournamentId }),
          (cache) => cache && cache.concat(removedPlayerDb),
        );
      }
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersOut.queryKey({ tournamentId }),
      });
      break;
    case 'set-game-result':
      queryClient.setQueryData(
        trpc.tournament.roundGames.queryKey({
          tournamentId,
          roundNumber: message.roundNumber,
        }),
        (cache) => {
          if (!cache) return cache;
          const index = cache.findIndex((obj) => obj.id == message.gameId);
          cache[index].result = message.result;
          return cache;
        },
      );
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.roundGames.queryKey({
          tournamentId,
          roundNumber: message.roundNumber,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      break;
    case 'start-tournament':
      queryClient.setQueryData(
        trpc.tournament.info.queryKey({ tournamentId }),
        (cache) => {
          if (!cache) return cache;
          cache.tournament.started_at = message.started_at;
          return cache;
        },
      );
    case 'reset-tournament':
      queryClient.setQueryData(
        trpc.tournament.info.queryKey({ tournamentId }),
        (cache) => {
          if (!cache) return cache;
          cache.tournament.started_at = null;
          return cache;
        },
      );
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.info.queryKey({ tournamentId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.allGames.queryKey({ tournamentId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
      setRoundInView(1);
      break;
    case 'new-round':
      queryClient.setQueryData(
        trpc.tournament.roundGames.queryKey({
          tournamentId,
          roundNumber: message.roundNumber,
        }),
        message.newGames,
      );
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.allGames.queryKey({ tournamentId }),
      });
      if (message.isTournamentGoing) {
        queryClient.invalidateQueries({
          queryKey: trpc.tournament.info.queryKey({ tournamentId }),
        });
      }
      if (message.isTournamentGoing) {
        setRoundInView(message.roundNumber);
      }
      break;
    case 'error':
      toast.error(errorMessage, { id: 'wsErrorMessage' });
    default:
      break;
  }
};
