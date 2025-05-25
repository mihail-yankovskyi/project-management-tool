import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../shared/services/auth.service";
import { login, loginFailed, loginSuccess, logout, register, registerFailed } from "./user.actions";
import { catchError, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { getTeamDetails } from "../team/team.actions";

@Injectable()
export class UserEffects {
  actions$ = inject(Actions);
  authService = inject(AuthService);
  router = inject(Router);

  login$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    switchMap((action) => {
      return this.authService.login(action.email, action.password).pipe(
        switchMap((credentials) => {
          return [loginSuccess({ email: credentials?.user?.email || '', displayName: credentials?.user?.displayName || '' })];
        }),
        catchError(() => of(loginFailed()))
      )
    }),
  ));

  loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    switchMap(() => {
      this.router.navigate(['/']);
      return [getTeamDetails()];
    }),
  ));

  register$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    switchMap((action) => {
      return this.authService.register({
        name: action.name,
        surname: action.surname,
        email: action.email,
        password: action.password
      }).pipe(
        switchMap((user) => {
          return [loginSuccess({ email: user?.email || '', displayName: user?.displayName || ''})];
        }),
        catchError(() => of(registerFailed()))
      )
    })
  ));

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(logout),
    switchMap(() => {
      return this.authService.logout().pipe(
        tap(() => this.router.navigate(['/login']))
      )
    }),
  ), {dispatch: false});
}
