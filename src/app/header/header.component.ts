import { Component, inject } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectUserName } from '../reducers/user/user.selectors';
import { IAppState } from '../reducers/app-state.interface';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { logout } from '../reducers/user/user.actions';
import { MatDialog } from '@angular/material/dialog';
import { AddUserToTeamModal } from '../shared/components/add-user-to-team-modal/add-user-to-team-modal.component';
import { selectTeamName } from '../reducers/team/team.selectors';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);

  userName$ = this.store.select(selectUserName);
  initials$ = this.store.select(selectUserName).pipe(
    map(username => this.getInitials(username))
  );
  teamName$ = this.store.select(selectTeamName);

  constructor(
    private readonly store: Store<IAppState>,
  ) {}

  logout(): void {
    this.store.dispatch(logout());
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  }

  addMember(): void {
    const dialogRef = this.dialog.open(AddUserToTeamModal);

    dialogRef.afterClosed().subscribe();
  }
}
