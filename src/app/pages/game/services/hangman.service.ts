import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RequestBaseService } from 'src/app/services/request-base.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.BASE_URL + 'api/question'

@Injectable({
  providedIn: 'root',
})
export class HangmanService extends RequestBaseService {
  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findByMinigameId(minigameId?: number): Observable<any> {
    return this.http.get(API_URL + "/" + minigameId, {headers: this.getHeaders});
  }
}
