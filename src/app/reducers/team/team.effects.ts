import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AuthService } from "../../shared/services/auth.service";
import { catchError, of, switchMap } from "rxjs";
import { getTeamDetails, getTeamDetailsFailed, getTeamDetailsSuccess } from "./team.actions";
import { TaskService } from "../../shared/services/task.service";
import { getUsers } from "../team-users/team-users.actions";
import { getLists, setListsLoading } from "../lists/lists.actions";

@Injectable()
export class TeamEffects {
  actions$ = inject(Actions);
  authService = inject(AuthService);
  taskService = inject(TaskService);
  store = inject(Store);

  getTeamDetails$ = createEffect(() => this.actions$.pipe(
    ofType(getTeamDetails),
    switchMap(() => {
      return this.taskService.getUserTeams().pipe(
        switchMap((result) => {
          if(!result.length) {
            return [setListsLoading({ isLoading: false })]
          }

          const team = result[0];

          return [getTeamDetailsSuccess({
            team: {
              createdBy: team.createdBy,
              id: team.id,
              members: team.members,
              name: team.name,
              teamAdmin: team.teamAdmin
            }
          })];
        }),
        catchError(() => of(getTeamDetailsFailed()))
      )
    }),
  ));

  getTeamDetailsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(getTeamDetailsSuccess),
    switchMap(() => {
      return [getUsers(), getLists()];
    }),
  ));
}
