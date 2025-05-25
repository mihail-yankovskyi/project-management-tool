import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { getLists, getListsFailed, getListsSuccess, updateListsTitles, updateListsTitlesFailed, updateListsTitlesSuccess } from "./lists.actions";
import { TaskService } from "../../shared/services/task.service";
import { selectTeamId } from "../team/team.selectors";
import { Firestore } from '@angular/fire/firestore';
import { getTasks} from "../tasks/tasks.actions";

@Injectable()
export class ListsEffects {
  actions$ = inject(Actions);
  taskService = inject(TaskService);
  store = inject(Store);

  getLists$ = createEffect(() => this.actions$.pipe(
    ofType(getLists),
    withLatestFrom(this.store.select(selectTeamId)),
    switchMap(([_, teamId]) => {
      return this.taskService.getLists(teamId).pipe(
        switchMap((lists) => {
          return [getListsSuccess({ lists })];
        }),
        catchError(() => of(getListsFailed()))
      )
    }),
  ));

  getListsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(getListsSuccess),
    map(({ lists }) => getTasks())
  ));

  updateColumnTitles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateListsTitles),
      switchMap(({ updates }) => {
        return this.taskService.updateListsTitles(updates).pipe(
          map(() => updateListsTitlesSuccess({ updates })),
          catchError(() => of(updateListsTitlesFailed()))
        );
      })
    )
  );
}
