import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { TaskService } from '../../services/task.service';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../reducers/app-state.interface';
import { AuthService } from '../../services/auth.service';
import { selectTeamId } from '../../../reducers/team/team.selectors';

@Component({
  selector: 'add-todo-window',
  templateUrl: 'add-user-to-team-modal.component.html',
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './add-user-to-team-modal.component.scss'
})

export class AddUserToTeamModal implements OnInit {
  teamId$ = this.store.select(selectTeamId);
  addUserForm!: FormGroup;
  minDate: Date;

  constructor(
    private dialogRef: MatDialogRef<AddUserToTeamModal>,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private readonly store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: {listId: string}
  ) {
    this.minDate = new Date();
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.addUserForm = this.formBuilder.group({
      email: ['', Validators.required],
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addUser(): void {
    if (this.addUserForm.valid) {
      const email = this.addUserForm.get('email')?.value;

      this.teamId$.pipe(
        take(1)
      ).subscribe({
        next: (teamId) => {
          if (!teamId) {
            return;
          }

          this.taskService.addMemberToTeam(teamId, email)
            .then(() => {
              return this.authService.updateUserTeamId(email, teamId);
            })
            .then(() => {
              this.addUserForm.reset();
              this.dialogRef.close(true);
            })
            .catch((error) => {
              console.error(error);
            });
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}
