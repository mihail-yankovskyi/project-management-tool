import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../shared/services/auth.service";
import { getUsers, getUsersFailed, getUsersSuccess, removeTeamFromUser, removeTeamFromUserFailed, removeTeamFromUserSuccess } from "./team-users.actions";
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

  removeTeamFromUser$ = createEffect(() => this.actions$.pipe(
    ofType(removeTeamFromUser),
    switchMap((action) => {
      return from(this.authService.removeUserFromTeam(action.teamId, action.uid)).pipe(
        map(() => removeTeamFromUserSuccess({ teamId: action.teamId, uid: action.uid })),
        catchError(() => of(removeTeamFromUserFailed()))
      );
    }),
  ));
}
