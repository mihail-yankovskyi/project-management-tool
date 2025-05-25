import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TaskService } from "../../shared/services/task.service";
import { getTasks, getTasksFailed, getTasksSuccess } from "./tasks.actions";
import { catchError, of, switchMap } from "rxjs";

@Injectable()
export class TasksEffects {
  actions$ = inject(Actions);
  taskService = inject(TaskService);
  store = inject(Store);

  getTasks$ = createEffect(() => this.actions$.pipe(
    ofType(getTasks),
    switchMap(() => {
      return this.taskService.getAllTasksGrouped().pipe(
        switchMap((result) => [getTasksSuccess({tasks: result})]),
        catchError(() => of(getTasksFailed()))
      )
    }),
  ));
}
