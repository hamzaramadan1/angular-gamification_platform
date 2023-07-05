import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";

const API_URL = environment.BASE_URL + 'api/userMemoryGameScore';

@Injectable({
  providedIn: 'root'
})
export class UserMemoryGameScoreService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findScoreByMemoryGameId(memoryGameId?: number): Observable<any> {
    return this.http.get(API_URL + "/" + memoryGameId, {headers: this.getHeaders});
  }

  updateScoreByMemoryGameId(memoryGameId?: number, updatedScore?: number): Observable<any> {
    return this.http.put(API_URL + "/" + memoryGameId + "/" + updatedScore, {}, {headers: this.getHeaders});
  }

  getMemoryGameCount(memoryGameId?: number): Observable<any> {
    return this.http.get(API_URL + "/" + memoryGameId + "/count", {headers: this.getHeaders});
  }

}
