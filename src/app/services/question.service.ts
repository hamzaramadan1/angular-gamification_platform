import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {Question} from "../models/question.model";

const API_URL = environment.BASE_URL + 'api/question'

@Injectable({
  providedIn: 'root'
})
export class QuestionService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  saveQuestion(question: Question, minigameId?: number): Observable<any> {
    return this.http.post(API_URL + "/create/" + minigameId, question, {headers: this.getHeaders});
  }


}
