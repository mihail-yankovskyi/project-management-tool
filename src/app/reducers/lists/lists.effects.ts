import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, from, map, of, switchMap, withLatestFrom } from "rxjs";
import { getLists, getListsFailed, getListsSuccess, updateListsTitles, updateListsTitlesFailed, updateListsTitlesSuccess } from "./lists.actions";
import { TaskService } from "../../shared/services/task.service";
import { selectTeamId } from "../team/team.selectors";
import { getDocs } from "firebase/firestore";
import {
  Firestore,
  collection,
} from '@angular/fire/firestore';
import { getTasksFailed, getTasksSuccess } from "../tasks/tasks.actions";
import { ITaskItem } from "../../shared/interfaces/task-item.interface";

@Injectable()
export class ListsEffects {
  actions$ = inject(Actions);
  taskService = inject(TaskService);
  store = inject(Store);
  private firestore: Firestore;

  constructor() {
    this.firestore = inject(Firestore);
  }

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
    switchMap(({ lists }) => {
      const listIds = lists.map(list => list.id);

      return from(getDocs(collection(this.firestore, 'tasks'))).pipe(
        map(snapshot => {
          const tasks = snapshot.docs
            .map(doc => ({
              ...(doc.data() as ITaskItem)
            }))
            .filter(task => listIds.includes(task.listId));

          return getTasksSuccess({ tasks });
        }),
        catchError(error =>
          of(getTasksFailed())
        )
      );
    })
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
