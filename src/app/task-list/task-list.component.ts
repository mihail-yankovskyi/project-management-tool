import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { TaskColumnComponent } from "../task-column/task-column.component";
import { IList } from '../shared/interfaces/task-item.interface';

@Component({
  selector: 'app-task-list',
  imports: [CdkDropListGroup, TaskColumnComponent, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  @Input() lists!: IList[] | null;
}
