import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {MemoryGame} from "../models/memoryGame.model";

const API_URL = environment.BASE_URL + 'api/memory_game'

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  saveMemoryGame(memoryGame: MemoryGame, courseId?: number): Observable<any> {
    return this.http.post(API_URL + "/create/" + courseId, memoryGame, {headers: this.getHeaders});
  }

  findAllMemoryGamesForUser(): Observable<any> {
    return this.http.get(API_URL + "/allForUser", {headers: this.getHeaders});
  }

  findAllMemoryGamesForUserCount(): Observable<any> {
    return this.http.get(API_URL + '/all/count', {headers: this.getHeaders});
  }

  findAllMemoryGames(): Observable<any> {
    return this.http.get(API_URL + "/all", {headers: this.getHeaders});
  }

  findAllMemoryGamesCount(): Observable<any> {
    return this.http.get(API_URL + '/all/allCount', {headers: this.getHeaders});
  }

  deleteMemoryGame(id: number): Observable<any> {
    return this.http.delete(API_URL + '/delete/' + id, {headers: this.getHeaders});
  }
}
