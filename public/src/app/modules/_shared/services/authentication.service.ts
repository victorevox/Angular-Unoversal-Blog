import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { AlertsService } from '@app/services/alerts.service';
import { StorageService } from '@appsrc/app/services/storage.service';
import { IUser, USER_ROLE, IAuthenticationEvent, ISignupCredentials, AUTH_EVENT_TYPES, ILoginCredentials, ILoginResponse } from "@shared/interfaces";
import { NotificationsService } from 'angular2-notifications';
import { Location } from "@angular/common";
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  private token_name = "access-token";
  public events: EventEmitter<IAuthenticationEvent> = new EventEmitter();

  constructor(private http: HttpClient, private _alert: AlertsService, private _location: Location, private _storageService: StorageService, private _notifications: NotificationsService) {

  }

  signupByCredentials(credentials: ISignupCredentials): Observable<HttpResponse<any>> {
    return this.http.post("/api/authentication/register", credentials).pipe(
      tap((response: HttpResponse<any>) => {
        console.log(response);
        this.emit(AUTH_EVENT_TYPES.SIGNUP)
      }),
      catchError(err => {
        this.handleError(err);
        throw err
      })
    )
    // return new Promise((resolve, reject) => {
    // })
  }

  loginByCredentials(credentials: ILoginCredentials): Observable<ILoginResponse> {
    return this.http.post("/api/authentication/login", credentials).pipe(
      tap((response: ILoginResponse) => {
        try {
          let token = response.token;
          this.saveToken(token);
          console.log(token)
          this.emit(AUTH_EVENT_TYPES.LOGIN);
        } catch (error) {
          console.log(response);
        }
      }),
      catchError(err => {
        this.handleError(err);
        throw err;
      })
    )
    // return new Promise((resolve, reject) => {
    //   console.log("Login by credentials");
    // })
  }

  loginFacebook() {
    this._location.go("/api/authentication/facebook");
    window && window.location.reload();
    // this._location.replaceState("/api/authentication/facebook");
  }

  isAunthenticated(): boolean {
    let user = this.getUser();
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this._storageService.removeItem(this.token_name);
    this.emit(AUTH_EVENT_TYPES.LOGOUT);
  }

  getToken(): string {
    return this._storageService.getItem(this.token_name);
  }

  saveToken(token: string) {
    this._storageService.setItem(this.token_name, token);
  }

  public isAdmin() {
    if (!this.getUser()) return false;
    return this.getUser().roles.indexOf(USER_ROLE.ADMIN) !== -1;
  }

  getUser(): IUser {
    let token = this.getToken();
    if (!token) return null;
    let user: IUser = null;
    try {
      let string = atob(token.split('.')[1]);
      user = <IUser>JSON.parse(string);
      if (!user.username && user.email) {
        user.username = user.email;
      }
    } catch (err) {
      console.error(err);
    }
    return user;
  }

  handleError = (err: Error | HttpResponse<any>) => {
    if (err instanceof Error) {
      console.log(err);
      this._alert.create("error", err.message, "Error");
    } else if (err instanceof HttpResponse) {
      try {
        let error = err.body();
        console.log(error)
        this._alert.create("error", error.message ? error.message : error, "Error");
      } catch (_err) {
        let error = err.toString();
        this._alert.create("error", error, "Error");
        console.log(error);
      }
    }
  }

  emit(eventType: AUTH_EVENT_TYPES) {
    this.events.emit(<IAuthenticationEvent>{ type: eventType })
  }

}