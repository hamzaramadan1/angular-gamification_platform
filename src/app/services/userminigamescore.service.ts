import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {Minigame} from "../models/minigame.model";

const API_URL = environment.BASE_URL + 'api/userminigamescore'

@Injectable({
  providedIn: 'root'
})
export class UserMinigameScoreService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findScoreByMinigameId(minigameId?: number): Observable<any> {
    return this.http.get(API_URL + "/" + minigameId, {headers: this.getHeaders});
  }

}
