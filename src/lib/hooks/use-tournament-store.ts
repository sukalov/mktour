import { getTournamentState } from '@/lib/get-tournament-state';
import {
  Format,
  GameModel,
  PlayerModel,
  TournamentModel,
  TournamentStatus,
  TournamentType,
} from '@/types/tournaments';
import { makeObservable } from 'mobx';
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
    makeObservable(this, {
      id: true,
      date: true,
      title: true,
      type: true,
      format: true,
      organizer: true,
      organizer_id: true,
      status: true,
      rounds_number: true,
      players: true,
      games: true,
      isLoading: true
    });
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
    this.isLoading = false;
  }

  isLoading = this.organizer_id === '';
}
