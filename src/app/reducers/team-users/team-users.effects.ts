import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, from, map, of, switchMap, withLatestFrom } from "rxjs";
import { AuthService } from "../../shared/services/auth.service";
import { TaskService } from "../../shared/services/task.service";
import { selectTeamId } from "../team/team.selectors";
import { addUser, addUserFailed, addUserSuccess, getUsers, getUsersFailed, getUsersSuccess, removeTeamFromUser, removeTeamFromUserFailed, removeTeamFromUserSuccess } from "./team-users.actions";

@Injectable()
export class TeamUsersEffects {
  actions$ = inject(Actions);
  authService = inject(AuthService);
  taskService = inject(TaskService);
  store = inject(Store);

  getUsers$ = createEffect(() => this.actions$.pipe(
    ofType(getUsers),
    withLatestFrom(this.store.select(selectTeamId)),
    switchMap(([_, teamId]) => {
      return from(this.authService.getAllUsers(teamId)).pipe(
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

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(addUser),
    switchMap((action) => {
      return from(this.taskService.addMemberToTeam(action.teamId, action.email)).pipe(
        map((user) => {
          return addUserSuccess({ user: {...user, teamId: action.teamId} })
        }),
        catchError(() => of(addUserFailed()))
      );
    }),
  ));
}
