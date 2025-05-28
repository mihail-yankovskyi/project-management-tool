import { Component, OnInit, Inject } from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {first, map, startWith } from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TaskService } from '../shared/services/task.service';
import { ITaskItem } from '../shared/interfaces/task-item.interface';
import { Store } from '@ngrx/store';
import { selectTeamUsers } from '../reducers/team-users/team-users.selectors';
import { IAppState } from '../reducers/app-state.interface';
import { IUser } from '../shared/interfaces/user.interface';

@Component({
  selector: 'app-edit-modal-window',
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule, AsyncPipe],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-modal-window.component.html',
  styleUrl: './edit-modal-window.component.scss'
})

export class EditModalWindowComponent implements OnInit {
  teamUsers$ = this.store.select(selectTeamUsers);
  filteredOptions$!: Observable<IUser[]>;

  taskForm!: FormGroup;
  teamUsers: IUser[] = [];
  minDate: Date;

  constructor(
    private dialogRef: MatDialogRef<EditModalWindowComponent>,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: {task: ITaskItem}
  ) {
    this.minDate = new Date();
  }

  ngOnInit() {
    this.setTeamUsers();
    this.initializeForm();
    this.createSubscription();
  }

  createSubscription(): void {
      this.filteredOptions$ = this.taskForm.get('assignedTo')!.valueChanges.pipe(
      startWith(null),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.teamUsers.slice();
      }),
    );
  }

  setTeamUsers(): void {
    this.teamUsers$
    .pipe(first((teamUsers) => !!teamUsers?.length))
    .subscribe((teamUsers) => this.teamUsers = teamUsers);
  }

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      assignedTo: [this.getAssignedUser(this.data.task.assignedTo), Validators.required],
      title: [this.data.task.title, Validators.required],
      description: [this.data.task.description, Validators.required],
      dueDate: [this.data.task.dueDate ? new Date(this.data.task.dueDate) : null],
      estimatedStoryPoints: [this.data.task.estimatedStoryPoints, null],
      actualStoryPoints: [this.data.task.actualStoryPoints, null]
    })
  }

  getAssignedUser(userId: string | undefined): IUser | undefined {
    return this.teamUsers.find((user) => user.uid === userId);
  }

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return d ? d >= today : false;
  }

  displayFn(user: IUser): string {
    return user.displayName || '';
  }

  private _filter(name: string): IUser[] {
    const filterValue = name.toLowerCase();

    return this.teamUsers.filter(option => option.displayName.toLowerCase().includes(filterValue));
  }

  cancel(): void {
    this.dialogRef.close();
  }

  update(): void {
    if (this.taskForm.valid) {
      const updatedInfo = this.taskForm.value;

      let formattedDate = '';

      if (updatedInfo.dueDate) {
        const date = new Date(updatedInfo.dueDate);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        formattedDate = `${month}/${day}/${year}`;
      }

      const updatedTask: ITaskItem = {
        ...this.data.task,
        title: updatedInfo.title,
        description: updatedInfo.description,
        dueDate: formattedDate || this.data.task.dueDate,
        estimatedStoryPoints: updatedInfo.estimatedStoryPoints,
        actualStoryPoints: updatedInfo.actualStoryPoints,
        assignedTo: updatedInfo.assignedTo.uid
      };

      this.taskService.updateTask(updatedTask);

      this.dialogRef.close(updatedTask);
    }
  }
}
