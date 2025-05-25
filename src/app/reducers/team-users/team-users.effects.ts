import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../shared/services/auth.service";
import { getUsers, getUsersFailed, getUsersSuccess } from "./team-users.actions";
import { catchError, from, map, of, switchMap } from "rxjs";

@Injectable()
export class TeamUsersEffects {
  actions$ = inject(Actions);
  authService = inject(AuthService);

  getUsers$ = createEffect(() => this.actions$.pipe(
    ofType(getUsers),
    switchMap(() => {
      return from(this.authService.getAllUsers()).pipe(
        map(users => getUsersSuccess({ users })),
        catchError(() => of(getUsersFailed()))
      );
    }),
  ));
}
