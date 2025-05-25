import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ITaskItem } from '../shared/interfaces/task-item.interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { IAppState } from '../reducers/app-state.interface';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectUserName } from '../reducers/user/user.selectors';
import { selectTeamUsers } from '../reducers/team-users/team-users.selectors';
import { selectAllLists } from '../reducers/lists/lists.selectors';

@Component({
  selector: 'app-task-details',
  imports: [MatDialogModule, MatButtonModule, AsyncPipe, CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})

export class TaskDetailsComponent implements OnInit {
  userName$ = this.store.select(selectTeamUsers).pipe(
    map(teamUsers => teamUsers.find((teamUser) => teamUser.uid === this.task?.assignedTo)),
    map(user => user!.displayName)
  )
  initials$ = this.store.select(selectTeamUsers).pipe(
    map(teamUsers => teamUsers.find((teamUser) => teamUser.uid === this.task?.assignedTo)),
    map(user => this.getInitials(user!.displayName))
  )
  userColor$ = this.store.select(selectUserName).pipe(
    map(userName => this.generateColorFromName(userName || ''))
  );
  listName$ = this.store.select(selectAllLists).pipe(
    map(allLists => allLists.find((list) => list.id === this.task.listId)),
    map((list) => list?.title)
  );

  task: ITaskItem;
  isPastDue: boolean = false;
  isActualPoints: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: ITaskItem },
    private dialogRef: MatDialogRef<TaskDetailsComponent>,
    private readonly store: Store<IAppState>
  ) {
    this.task = data.task;
  }

  ngOnInit(): void {
    this.checkIfPastDue();
    this.checkIfActualPointsIs();
  }

  formatDate(dateValue: any): string {
    if (!dateValue) return 'Not set';

    let date: Date;

    if (dateValue && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
    }
    else if (dateValue.seconds !== undefined) {
      date = new Date(dateValue.seconds * 1000);
    }
    else if (dateValue instanceof Date) {
      date = dateValue;
    }
    else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    }
    else {
      return String(dateValue);
    }

    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  }

  private generateColorFromName(name: string): string {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFC107', '#FF9800', '#FF5722', '#795548'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + (hash * 31);
    }

    const index = Math.abs(hash % colors.length);
    return colors[index];
  }

  editTask(): void {
    this.dialogRef.close({ action: 'edit', task: this.task });
  }

  deleteTask(): void {
    this.dialogRef.close({ action: 'delete', taskId: this.task.id });
  }

  checkIfPastDue(): boolean {
    let dueDate: Date;
    dueDate = new Date(this.task.dueDate ?? new Date());
    dueDate.setHours(23, 59, 59, 999);
    const today = new Date();
    this.isPastDue = dueDate < today;

    return this.isPastDue;
  }

  checkIfActualPointsIs(): boolean {
    if(this.task.actualStoryPoints) {
      this.isActualPoints = true
    } else {
      this.isActualPoints = false;
    }

    return this.isPastDue;
  }
}
