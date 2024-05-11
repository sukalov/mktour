import { getTournamentState } from '@/lib/get-tournament-state';
import {
  Format,
  GameModel,
  PlayerModel,
  TournamentModel,
  TournamentStatus,
  TournamentType,
} from '@/types/tournaments';
// import { action, observable } from 'mobx';

export class TournamentStore implements TournamentModel {
  public id: string = '';
  public date: string = '';
  public title: string = '';
  public type: TournamentType | undefined = undefined; // Assuming TournamentType is defined elsewhere
  public format: Format | undefined = undefined; // Assuming Format is defined elsewhere
  public organizer: string = '';
  public organizer_id: string = '';
  public status: TournamentStatus | undefined = undefined; // Assuming TournamentStatus is defined elsewhere
  public rounds_number: number | null = null;
  public players: Array<PlayerModel> = [];
  public games: Array<GameModel> = [];

  constructor(id: string) {
    this.loadTournament(id);
  }

  async loadTournament(id: string) {
    let tournament = await getTournamentState(id);
    this.id = id;
    this.date = tournament.date;
    this.title = tournament.title;
    this.type = tournament.type;
    this.format = tournament.format;
    this.organizer = tournament.organizer;
    this.organizer_id = tournament.organizer_id;
    this.status = tournament.status;
    this.rounds_number = tournament.rounds_number;
    this.players = tournament.players;
    this.games = tournament.games;
  }

  isLoading = this.organizer_id === '';
}
