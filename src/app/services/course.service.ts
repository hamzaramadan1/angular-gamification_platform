import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {RequestBaseService} from "./request-base.service";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Course} from "../models/course.model";

const API_URL = environment.BASE_URL + 'api/course'

@Injectable({
  providedIn: 'root'
})
export class CourseService extends RequestBaseService {

  constructor(authenticationService: AuthenticationService, http: HttpClient) {
    super(authenticationService, http);
  }

  findAllCoursesForUser(): Observable<any> {
    return this.http.get(API_URL + "/allForUser", {headers: this.getHeaders});
  }

  findAllCoursesForUserCount(): Observable<any> {
    return this.http.get(API_URL + '/all/count', {headers: this.getHeaders});
  }

  saveCourse(courseName: string, courseDescription: string, courseLink: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("courseName", courseName);
    formData.append("courseDescription", courseDescription);
    formData.append("courseLink", courseLink);
    formData.append("file", file, file.toString());
    return this.http.post(API_URL + '/create', formData, {headers: this.getMultiPartHeaders});
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(API_URL + '/delete/' + id, {headers: this.getHeaders});
  }
}
