import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { TaskListComponent } from "../task-list/task-list.component";
import { map, Observable } from 'rxjs';

import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {AsyncPipe} from '@angular/common';
import { IList } from '../shared/interfaces/task-item.interface';
import { TaskService } from '../shared/services/task.service';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducers/app-state.interface';
import { selectTeamId } from '../reducers/team/team.selectors';
import { getTeamDetails } from '../reducers/team/team.actions';
import { selectAllLists, selectAllListsIsLoading } from '../reducers/lists/lists.selectors';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ChartComponent } from "../chart/chart.component";

@Component({
  selector: 'app-project-management',
  imports: [HeaderComponent, TaskListComponent, MatProgressSpinnerModule, MatTabsModule, AsyncPipe, MatButtonModule, ChartComponent],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss'
})
export class ProjectManagementComponent {
  teamId$ = this.store.select(selectTeamId);
  allListsIsLoading$ = this.store.select(selectAllListsIsLoading);
  lists$: Observable<IList[]> = this.store.select(selectAllLists);

  private taskService!: TaskService;

  constructor(private readonly store: Store<IAppState>) {
    this.taskService = inject(TaskService);
  }

  creatNewBoard(): void {
    this.taskService.createListsForNewUser().then(() => {
      this.store.dispatch(getTeamDetails())
      this.lists$ = this.taskService.getLists().pipe(
        map((lists) => lists.sort((a, b) => a.order - b.order))
      )
    });
  }
}
