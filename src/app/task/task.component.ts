import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { ITaskItem } from '../shared/interfaces/task-item.interface';
import { first} from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducers/app-state.interface';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskService } from '../shared/services/task.service';
import { EditModalWindowComponent } from '../edit-modal-window/edit-modal-window.component';
import { CommonModule } from '@angular/common';
import { selectTeamUsers } from '../reducers/team-users/team-users.selectors';

@Component({
  selector: 'app-task',
  imports: [CdkDrag, MatButtonModule, CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent implements OnInit, OnChanges {
  @Input() task!: ITaskItem;

  teamUsers$ = this.store.select(selectTeamUsers);

  isPastDue: boolean = false;
  isActualPoints: boolean = false;
  initials: string = '';

  readonly dialog = inject(MatDialog);
  formattedDueDate: string = '';

  constructor(
    private readonly store: Store<IAppState>,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.task.dueDate) {
      this.formattedDueDate = this.formatDueDate(this.task.dueDate);
    }

    this.checkIfPastDue();
    this.checkIfActualPointsIs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.setInitials(this.task?.assignedTo || '')
    }
  }

  setInitials(uid: string): void {
    this.teamUsers$
      .pipe(
        first((teamUsers) => !!teamUsers.length)
      )
      .subscribe((teamUsers) => {
        const foundUser = teamUsers.find((user) => user.uid === uid);
        this.initials = this.getInitials(foundUser?.displayName || '');
      })
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  }

  formatDueDate(dateValue: any): string {
    if (!dateValue) return '';

    let date: Date;

    if (typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
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

  onTaskClick() {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      data: { task: this.task },
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'full-width-dialog',
      position: { top: '100px' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
        if (result.action === 'edit') {

          const updateDialogRef = this.dialog.open(EditModalWindowComponent, {
            data: { task: this.task }
          })

          updateDialogRef.afterClosed().subscribe(updateResult => {
            if (updateResult) {

              if (this.task.dueDate) {
                this.formattedDueDate = this.formatDueDate(this.task.dueDate);
              }

              this.checkIfPastDue();
              this.checkIfActualPointsIs();
            }
          });
        } else if (result.action === 'delete') {
          this.taskService.deleteTask(result.taskId).then(() => {
          }).catch(error => {
            console.error(error);
          });
        }
      }
    });
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
      this.isActualPoints = false
    }

    return this.isActualPoints;
  }
}
