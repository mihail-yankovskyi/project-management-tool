import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { IAppState } from '../reducers/app-state.interface';
import { selectAllTasks } from '../reducers/tasks/tasks.selectors';
import { selectAllLists } from '../reducers/lists/lists.selectors';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-chart',
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  allTasks$ = this.store.select(selectAllTasks);
  allLists$ = this.store.select(selectAllLists);
  chartData$ = combineLatest([this.allTasks$, this.allLists$])
    .pipe(
      map(([allTasks, allLists]) => {
        if (!allTasks || !allLists.length) {
          return [];
        }

        const listsWithTasks = Object.keys(allTasks);
        const chartData = listsWithTasks.map((listId) => {
          const listName = allLists.find((list) => list.id === listId)?.title;
          const numberOfTaks = allTasks[listId]?.length || 0;

          return { name: listName, value: numberOfTaks };
        });

        return chartData;
      })
    );
  tasksCount$ = this.allTasks$.pipe(
    map((allTasks) => {
      if (!allTasks) {
        return 0;
      }

      let result = 0;
      const listsWithTasks = Object.keys(allTasks);

      listsWithTasks.forEach((listId: string) => {
        const totalTasks = allTasks[listId]?.length || 0;
        result += totalTasks;
      });

      return result;
    })
  )

  view: [number, number] = [900, 500];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#B8E6FC', '#FFE088', '#FFB3F0', '#FFB8C8']
  };

  constructor(private store: Store<IAppState>) {}
}
