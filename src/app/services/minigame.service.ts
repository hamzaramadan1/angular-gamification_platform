import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {Minigame} from "../models/minigame.model";

const API_URL = environment.BASE_URL + 'api/minigame'

@Injectable({
  providedIn: 'root'
})
export class MinigameService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  saveMinigame(minigame: Minigame, courseId?: number): Observable<any> {
    return this.http.post(API_URL + "/create/" + courseId, minigame, {headers: this.getHeaders});
  }


}
