import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HTTP_INTERCEPTORS
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import jwtDecode, {JwtPayload} from "jwt-decode";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../models/user.model";

const HEADER_AUTHORIZATION = "authorization";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private jwt: JwtPayload = {};

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.headers.has(HEADER_AUTHORIZATION)) {
      return this.handleToken(request, next);
    } else {
      return next.handle(request);
    }
    return next.handle(request);
  }

  private handleToken(request: HttpRequest<unknown>, next: HttpHandler) {
    this.jwt = jwtDecode(this.authenticationService.currentUserValue.accessToken);

    const nowInSecs = Date.now();
    const exp = this.jwt.exp || 0;

    if (exp > nowInSecs) {
      return next.handle(request);
    } else {
      return this.authenticationService.refreshToken().pipe(
        switchMap((response: User) => {
          this.authenticationService.setSessionStorage(response);

          const cloned = request.clone({
            headers: request.headers.set(HEADER_AUTHORIZATION, 'Bearer ' + response.accessToken)
          });

          return next.handle(cloned);
        }),
        catchError( err => {
          return throwError(err);
        })
      );
    }
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
