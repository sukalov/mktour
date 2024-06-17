// import { removePlayer } from '@/lib/actions/tournament-managing';
// import { DatabasePlayer } from '@/lib/db/schema/tournaments';
// import { QueryClient, useMutation } from '@tanstack/react-query';
// import { toast } from 'sonner';

// export const useTournamentAddNewPlayer = (
//   tournamentId: string,
//   queryClient: QueryClient,
//   sendJsonMessage: (_message: Message) => void,
// ) => {
//   return useMutation({
//     mutationKey: ['players', tournamentId, 'players-add-new'],
//     mutationFn: addNewPlayer,
//     onMutate: async ({ playerId }) => {
//       await queryClient.cancelQueries({ queryKey: ['players', tournamentId] });
//       const previousState: Array<DatabasePlayer> | undefined =
//         queryClient.getQueryData(['players', tournamentId, 'players-added']);

//       queryClient.setQueryData(
//         ['players', tournamentId, 'players-added'],
//         (cache: Array<DatabasePlayer>) =>
//           cache.filter((player) => player.id !== playerId),
//       );
//       return { previousState };
//     },
//     onError: (_err, _, context) => {
//       if (context?.previousState) {
//         queryClient.setQueryData(
//           ['players', tournamentId, 'players-added'],
//           context.previousState,
//         );
//       }
//       toast.error("sorry! could't remove player from the tournament", {
//         id: 'remove-player-error',
//         duration: 3000,
//       });
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['players', tournamentId] });
//     },
//     onSuccess: (_err, data) => {
//       console.log('player removed');
//       sendJsonMessage({ type: 'remove-player', id: data.playerId });
//     },
//   });
// };
