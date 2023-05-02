import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user.model";

const API_URL = environment.BASE_URL + 'api/user'

@Injectable({
  providedIn: 'root'
})
export class UserService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  checkAnswer(userAnswer: string, minigameId: number): Observable<any> {
    return this.http.post(API_URL + '/user/answer/' + userAnswer + '/' + minigameId, {}, {headers: this.getHeaders});
  }

  uploadProfilePicture(username: string, formData: FormData): Observable<any> {
    return this.http.post(API_URL + '/profile-picture/' + username, formData, {headers: this.getHeaders});
  }

  findAllCourses(): Observable<any> {
    return this.http.get(API_URL + "/user/courses/all", {headers: this.getHeaders});
  }

  findAllMinigamesForCourse(courseId: number): Observable<any> {
    return this.http.get(API_URL + "/user/minigames/" + courseId, {headers: this.getHeaders});
  }

  findAllUsersUsersCount(): Observable<any> {
    return this.http.get(API_URL + '/admin/allUsers', {headers: this.getHeaders});
  }

  updateUser(user: User, currentPassword: string): Observable<any> {
    return this.http.put(API_URL + "/update/" + currentPassword, user, {headers: this.getHeaders});
  }

  updateProfilePic(userImageFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("userImageFile", userImageFile, userImageFile.toString());
    return this.http.put(API_URL + '/update/updateProfilePic', formData, {headers: this.getMultiPartHeaders});
  }
}
