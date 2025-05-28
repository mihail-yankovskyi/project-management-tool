import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../reducers/app-state.interface';
import { selectCurrentTeam } from '../../../reducers/team/team.selectors';
import { updateTeamDetails } from '../../../reducers/team/team.actions';

@Component({
  selector: 'add-todo-window',
  templateUrl: 'change-project-name-modal.component.html',
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './change-project-name-modal.component.scss'
})

export class ChangeProjectNameModal implements OnInit {
  team$ = this.store.select(selectCurrentTeam);
  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ChangeProjectNameModal>,
    private formBuilder: FormBuilder,
    private readonly store: Store<IAppState>,
    ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
      projectName: ['', Validators.required],
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const projectName = this.form.get('projectName')?.value || '';

      this.team$
        .pipe(take(1))
        .subscribe((team) => {
          this.store.dispatch(updateTeamDetails({
            teamId: team!.id,
            teamData: {
              name: projectName
            }
          }))
        });

      this.dialogRef.close();
    }
  }
}
