import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { IAppState } from '../reducers/app-state.interface';
import { Store } from '@ngrx/store';
import { selectRealTeamUsers } from '../reducers/team-users/team-users.selectors';
import { CommonModule } from '@angular/common';
import { TeamMemberComponent } from "../team-member/team-member.component";
import { selectCurrentTeam, selectTeamName } from '../reducers/team/team.selectors';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddUserToTeamModal } from '../shared/components/add-user-to-team-modal/add-user-to-team-modal.component';
import { ChangeProjectNameModal } from '../shared/components/change-project-name-modal/change-project-name-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditColumnsModalWindowComponent } from '../edit-columns-modal-window/edit-columns-modal-window.component';

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent, CommonModule, TeamMemberComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  readonly dialog = inject(MatDialog);

  usersList$ = this.store.select(selectRealTeamUsers);
  team$ = this.store.select(selectCurrentTeam);
  realUsersList$ = combineLatest([this.usersList$, this.team$])
    .pipe(map(([usersList, team]) => usersList.filter((user) => (user.teamId === team?.id) && (user.uid !== team?.teamAdmin))));
  teamName$ = this.store.select(selectTeamName);

  constructor(
    private router: Router,
    private store: Store<IAppState>
  ) {}

  addMember(): void {
    const dialogRef = this.dialog.open(AddUserToTeamModal);

    dialogRef.afterClosed().subscribe();
  }

  changeProjectName(): void {
    const dialogRef = this.dialog.open(ChangeProjectNameModal);

    dialogRef.afterClosed().subscribe();
  }

  backToTasks(): void {
    this.router.navigate(['/']);
  }

  editColumns() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(EditColumnsModalWindowComponent, dialogConfig);

    dialogRef.afterClosed().subscribe();
  }
}
