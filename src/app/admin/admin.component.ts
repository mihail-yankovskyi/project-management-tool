import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { IAppState } from '../reducers/app-state.interface';
import { Store } from '@ngrx/store';
import { getTeamUsers, selectRealTeamUsers, selectTeamUsers } from '../reducers/team-users/team-users.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { getUsers } from '../reducers/team-users/team-users.actions';
import { IUser } from '../shared/interfaces/user.interface';

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  usersList$ = this.store.select(selectRealTeamUsers);

  constructor(private store: Store<IAppState>) {}
}
