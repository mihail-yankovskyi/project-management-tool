import { Component, Input, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from "../task/task.component";
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { IList, ITaskItem } from '../shared/interfaces/task-item.interface';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { AddTodoWindow } from '../shared/components/modal-window/modal-window.component';
import { TaskService } from '../shared/services/task.service';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { EditColumnsModalWindowComponent } from '../edit-columns-modal-window/edit-columns-modal-window.component';

@Component({
  selector: 'app-task-column',
  imports: [TaskComponent, CdkDropList, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskColumnComponent implements OnInit {
  @Input() list!: IList;
  @Input() showButton: boolean = false;
  @Input() columnIndex!: number;

  tasks$ = new BehaviorSubject<ITaskItem[]>([]);

  readonly dialog = inject(MatDialog);

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getCurrentTasks();
  }

  getCurrentTasks(): void {
    if (this.list?.id) {
      this.taskService.getTasksByList(this.list.id).subscribe((tasks) => {
        tasks = tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.tasks$.next(tasks);
        this.cdr.markForCheck();
      });
    }
  }

  drop(event: CdkDragDrop<ITaskItem[]>): void {
    const currentTasks = [...this.tasks$.value];

    if (event.previousContainer === event.container) {
      moveItemInArray(currentTasks, event.previousIndex, event.currentIndex);

      this.tasks$.next(currentTasks);

      currentTasks.forEach((task, index) => {
        task.order = index;
        this.taskService.moveTask(task.id, task.listId, index);
      });
    } else {
      const previousContainerTasks = [...event.previousContainer.data];

      transferArrayItem(
        previousContainerTasks,
        currentTasks,
        event.previousIndex,
        event.currentIndex
      );

      this.tasks$.next(currentTasks);

      currentTasks.forEach((task, index) => {
        const updatedListId = this.list.id;
        task.listId = updatedListId;
        task.order = index;
        this.taskService.moveTask(task.id, updatedListId, index);
      });
    }

    this.cdr.markForCheck();
  }

  openAddTodoWindow() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {listId: this.list.id};
    const dialogRef = this.dialog.open(AddTodoWindow, dialogConfig);

    dialogRef.afterClosed().subscribe();
  }

  editColumn() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {listTitle: this.list.title};
    const dialogRef = this.dialog.open(EditColumnsModalWindowComponent, dialogConfig);

    dialogRef.afterClosed().subscribe();
  }
}
