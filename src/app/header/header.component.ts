import { Component, inject } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectUserName, selectUserUid } from '../reducers/user/user.selectors';
import { IAppState } from '../reducers/app-state.interface';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { logout } from '../reducers/user/user.actions';
import { MatDialog } from '@angular/material/dialog';
import { selectTeamAdmin, selectTeamName } from '../reducers/team/team.selectors';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);

  userName$ = this.store.select(selectUserName);
  initials$ = this.store.select(selectUserName).pipe(map(username => this.getInitials(username)));
  teamName$ = this.store.select(selectTeamName);
  teamAdminId$ = this.store.select(selectTeamAdmin);
  userUid$ = this.store.select(selectUserUid);
  isAdmin$ = combineLatest([this.teamAdminId$, this.userUid$]).pipe(map(([teamAdminId, userUid]) => teamAdminId === userUid));

  constructor(
    private readonly store: Store<IAppState>,
    private readonly router: Router
  ) {}

  logout(): void {
    this.store.dispatch(logout());
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  }

  openAdminPanel(): void {
    this.router.navigate(['admin']);
  }
}
