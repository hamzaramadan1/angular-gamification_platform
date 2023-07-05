import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";

const API_URL = environment.BASE_URL + 'api/userPuzzleGameScore';

@Injectable({
  providedIn: 'root'
})
export class UserPuzzleGameScoreService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findScoreByPuzzleGameId(puzzleGameId?: number): Observable<any> {
    return this.http.get(API_URL + "/" + puzzleGameId, {headers: this.getHeaders});
  }

  updateScoreByPuzzleGameId(puzzleGameId?: number, updatedScore?: number): Observable<any> {
    return this.http.put(API_URL + "/" + puzzleGameId + "/" + updatedScore, {}, {headers: this.getHeaders});
  }

  getPuzzleGameCount(puzzleGameId?: number): Observable<any> {
    return this.http.get(API_URL + "/" + puzzleGameId + "/count", {headers: this.getHeaders});
  }

}
