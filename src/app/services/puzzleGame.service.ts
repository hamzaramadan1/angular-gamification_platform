import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {PuzzleGame} from "../models/puzzleGame.model";

const API_URL = environment.BASE_URL + 'api/puzzle_game'

@Injectable({
  providedIn: 'root'
})
export class PuzzleGameService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  savePuzzleGame(puzzleGame: PuzzleGame, courseId?: number): Observable<any> {
    return this.http.post(API_URL + "/create/" + courseId, puzzleGame, {headers: this.getHeaders});
  }

  findAllPuzzleGamesForUser(): Observable<any> {
    return this.http.get(API_URL + "/allForUser", {headers: this.getHeaders});
  }

  findAllPuzzleGamesForUserCount(): Observable<any> {
    return this.http.get(API_URL + '/all/count', {headers: this.getHeaders});
  }

  findAllPuzzleGames(): Observable<any> {
    return this.http.get(API_URL + "/all", {headers: this.getHeaders});
  }

  findAllPuzzleGamesCount(): Observable<any> {
    return this.http.get(API_URL + '/all/allCount', {headers: this.getHeaders});
  }

  deletePuzzleGame(id: number): Observable<any> {
    return this.http.delete(API_URL + '/delete/' + id, {headers: this.getHeaders});
  }
}