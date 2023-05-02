import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const API_URL = environment.BASE_URL + 'api/superadmin';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findAllUsers(): Observable<any> {
    return this.http.get(API_URL + '/all', {headers: this.getHeaders});
  }

  changeRole(newRole: string, id:number): Observable<any> {
    return this.http.put(API_URL + '/user/' + id + '/change/' + newRole, {}, {headers: this.getHeaders});
  }

  lockUser(id:number): Observable<any> {
    return this.http.post(API_URL + '/lock/' + id, {}, {headers: this.getHeaders});
  }

  unlockUser(id:number): Observable<any> {
    return this.http.post(API_URL + '/unlock/' + id, {}, {headers: this.getHeaders});
  }

  deleteUser(id:number): Observable<any> {
    return this.http.delete(API_URL + '/user/' + id, {headers: this.getHeaders});
  }
}
