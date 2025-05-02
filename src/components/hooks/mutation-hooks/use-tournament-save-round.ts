import { GameModel, TournamentInfo } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import {
  QueryClient,
  useMutation,
  useMutationState,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function useSaveRound(props: SaveRoundMutationProps) {
  const t = useTranslations('Toasts');
  const state = useMutationState({
    filters: {
      status: 'pending',
    },
  });
  return useMutation({
    mutationKey: [props.tournamentId, 'save-round'],
    mutationFn: async ({
      newGames,
      roundNumber,
    }: {
      tournamentId: string;
      newGames: GameModel[];
      roundNumber: number;
    }) =>
      fetch(`/api/tournament/${props.tournamentId}/round/${roundNumber}`, {
        method: 'POST',
        body: JSON.stringify(newGames),
      }),
    onMutate: ({ tournamentId, roundNumber, newGames }) => {
      if (props.isTournamentGoing) {
        props.setRoundInView(roundNumber);
      }
      props.queryClient.cancelQueries({
        queryKey: [tournamentId, 'games', { roundNumber }],
      });
      props.isTournamentGoing &&
        props.queryClient.setQueryData(
          [tournamentId, 'tournament'],
          (cache: TournamentInfo) => {
            cache.tournament.ongoing_round = roundNumber;
            return cache;
          },
        );
      props.queryClient.setQueryData(
        [tournamentId, 'games', { roundNumber }],
        () => newGames,
      );
    },
    onSuccess: (_data, { tournamentId, roundNumber, newGames }) => {
      if (state.length === 1) {
        props.sendJsonMessage({
          type: 'new-round',
          roundNumber,
          newGames,
          isTournamentGoing: props.isTournamentGoing,
        });
        if (props.queryClient.isMutating() === 1) {
          props.queryClient.invalidateQueries({
            queryKey: [tournamentId, 'games', { roundNumber }],
          });
          props.isTournamentGoing &&
            props.queryClient.invalidateQueries({
              queryKey: [tournamentId, 'tournament'],
            });
          props.queryClient.invalidateQueries({
            queryKey: [tournamentId, 'games', 'all'],
          });
        }
      }
    },
    onError: (_, { tournamentId, roundNumber }) => {
      props.isTournamentGoing && props.setRoundInView(roundNumber - 1);
      props.queryClient.setQueryData(
        [tournamentId, 'tournament'],
        (cache: TournamentInfo) => {
          cache.tournament.ongoing_round = roundNumber - 1;
          return cache;
        },
      );
      props.queryClient.removeQueries({
        queryKey: [tournamentId, 'games', { roundNumber }],
      });
      toast.error(t('server error'));
    },
  });
}

type SaveRoundMutationProps =
  | {
      tournamentId: string;
      queryClient: QueryClient;
      sendJsonMessage: (_message: Message) => void;
      isTournamentGoing: true;
      setRoundInView: Dispatch<SetStateAction<number>>;
    }
  | {
      tournamentId: string;
      queryClient: QueryClient;
      sendJsonMessage: (_message: Message) => void;
      isTournamentGoing: false;
    };
