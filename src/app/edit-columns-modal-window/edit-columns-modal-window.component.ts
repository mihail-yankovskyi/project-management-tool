import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IList } from '../shared/interfaces/task-item.interface';
import { IAppState } from '../reducers/app-state.interface';
import { Store } from '@ngrx/store';
import { selectAllLists } from '../reducers/lists/lists.selectors';
import { first } from 'rxjs/operators';
import { updateListsTitles } from '../reducers/lists/lists.actions';

@Component({
  selector: 'app-edit-columns-modal-window',
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-columns-modal-window.component.html',
  styleUrl: './edit-columns-modal-window.component.scss'
})
export class EditColumnsModalWindowComponent implements OnInit {
  lists$ = this.store.select(selectAllLists);

  columnForm!: FormGroup;
  lists: IList[] = [];
  minDate: Date;

  constructor(
    private dialogRef: MatDialogRef<EditColumnsModalWindowComponent>,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
  ) {
    this.minDate = new Date();
  }

  ngOnInit() {
    this.setLists();
  }

  setLists(): void {
    this.lists$
      .pipe(first((lists) => !!lists.length))
      .subscribe(lists => {
        this.lists = [...lists].sort((a, b) => a.order - b.order);
        this.initializeForm();
      });
  }

  initializeForm(): void {
    this.columnForm = this.formBuilder.group({
      title1: [this.lists[0].title || '', Validators.required],
      title2: [this.lists[1].title || '', Validators.required],
      title3: [this.lists[2].title || '', Validators.required],
      title4: [this.lists[3].title || '', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  update(): void {
    const updates: { id: string; title: string }[] = [];

    if (this.columnForm.valid) {
      const updatedInfo = this.columnForm.value;

      Object.keys(updatedInfo).forEach((formName, index) => {
        updates.push({id: this.lists[index]?.id, title: updatedInfo[formName]})
      });
      this.store.dispatch(updateListsTitles({updates}));
    }

    this.dialogRef.close();
  }
}
