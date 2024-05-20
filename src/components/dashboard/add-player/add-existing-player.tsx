import { PlayerProps } from '@/components/dashboard/add-player';
import {
  DatabasePlayerSlice,
  useTournamentStore,
} from '@/lib/hooks/use-tournament-store';
import { FC } from 'react';

const AddExistingPlayer: FC<PlayerProps> = ({
  value,
  handleAddPlayer,
}) => {
  const { possiblePlayers } = useTournamentStore();
  const filteredPlayers = possiblePlayers.filter(
    (player: DatabasePlayerSlice) => {
      const regex = new RegExp(value, 'i');
      if (value === '') return player;
      return regex.test(player.nickname);
    },
  );
  return (
    <>
      <PossiblePlayers players={filteredPlayers} addPlayer={handleAddPlayer} />
      {/* {getMockList(50)} */}
    </>
  );
};

const PossiblePlayers: FC<PossiblePlayersProps> = ({ players, addPlayer }) => {
  return players.map((player) => (
    <div
      key={player.id}
      className="flex w-full justify-between"
      onClick={() => addPlayer({ id: player.id })}
    >
      <span>{player.nickname}</span>
      <span className="text-muted">{player.rating}</span>
    </div>
  ));
};

type PossiblePlayersProps = {
  players: DatabasePlayerSlice[];
  addPlayer: any;
};

export default AddExistingPlayer;
