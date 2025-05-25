import { inject, Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TaskService } from "../../shared/services/task.service";

@Injectable()
export class TasksEffects {
  actions$ = inject(Actions);
  taskService = inject(TaskService);
  store = inject(Store);

  // getTasks$ = createEffect(() => this.actions$.pipe(
  //   ofType(getTasks),
  //   switchMap(() => {
  //     return this.taskService.getTasks().pipe(
  //       switchMap((result) => {
  //         const team = result[0];
  //         return [getTasksSuccess({
  //           team: {
  //             createdBy: team.createdBy,
  //             id: team.id,
  //             members: team.members,
  //             name: team.name
  //           }
  //         })];
  //       }),
  //       catchError(() => of(getTeamDetailsFailed()))
  //     )
  //   }),
  // ));
}
