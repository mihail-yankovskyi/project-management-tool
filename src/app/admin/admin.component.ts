import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { IAppState } from '../reducers/app-state.interface';
import { Store } from '@ngrx/store';
import { selectRealTeamUsers } from '../reducers/team-users/team-users.selectors';
import { CommonModule } from '@angular/common';
import { TeamMemberComponent } from "../team-member/team-member.component";
import { selectCurrentTeam } from '../reducers/team/team.selectors';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent, CommonModule, TeamMemberComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  usersList$ = this.store.select(selectRealTeamUsers).pipe();
  team$ = this.store.select(selectCurrentTeam);
  realUsersList$ = combineLatest([this.usersList$, this.team$])
    .pipe(map(([usersList, team]) => usersList.filter((user) => (user.teamId === team?.id) && (user.uid !== team?.teamAdmin))));

  constructor(private store: Store<IAppState>) {}
}
