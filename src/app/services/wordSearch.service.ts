import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestBaseService } from 'src/app/services/request-base.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

const API_URL = environment.BASE_URL + 'api/word_search';

@Injectable()
export class WordSearchService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findByPuzzleGameId(puzzleGameId?: number): Observable<any> {
    return this.http.get(API_URL + "/" + puzzleGameId, {headers: this.getHeaders});
  }
}