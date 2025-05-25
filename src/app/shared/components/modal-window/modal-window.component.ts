import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'add-todo-window',
  templateUrl: 'modal-window.component.html',
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './modal-window.component.scss'
})

export class AddTodoWindow implements OnInit {
  taskForm!: FormGroup;

  minDate: Date;

  constructor(
    private dialogRef: MatDialogRef<AddTodoWindow>,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: {listId: string}
  ) {
    this.minDate = new Date();
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: [null],
      estimatedStoryPoints: [null]
    })
  }

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return d ? d >= today : false;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;

      let formattedDate = '';
      if (formValues.dueDate) {
        const date = new Date(formValues.dueDate);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        formattedDate = `${month}/${day}/${year}`;
      }

      this.taskService.addTask(this.data.listId, formValues.title, formValues.description, formattedDate, formValues.estimatedStoryPoints);
    }
    this.dialogRef.close();
  }
}
