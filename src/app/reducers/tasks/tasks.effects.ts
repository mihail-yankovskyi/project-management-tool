import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, of, switchMap, withLatestFrom } from "rxjs";
import { TaskService } from "../../shared/services/task.service";
import { selectTeamId } from "../team/team.selectors";
import { getTasks, getTasksFailed, getTasksSuccess } from "./tasks.actions";

@Injectable()
export class TasksEffects {
  actions$ = inject(Actions);
  taskService = inject(TaskService);
  store = inject(Store);

  getTasks$ = createEffect(() => this.actions$.pipe(
    ofType(getTasks),
    withLatestFrom(this.store.select(selectTeamId)),
    switchMap(([_, teamId]) => {
      return this.taskService.getAllTasksGrouped(teamId).pipe(
        switchMap((result) => [getTasksSuccess({tasks: result})]),
        catchError(() => of(getTasksFailed()))
      )
    }),
  ));
}
