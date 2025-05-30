import { Component, inject, OnInit } from '@angular/core';
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
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, AsyncPipe, NgStyle, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  userName$ = this.store.select(selectUserName);
  initials$ = this.store.select(selectUserName).pipe(map(username => this.getInitials(username)));
  teamName$ = this.store.select(selectTeamName);
  teamAdminId$ = this.store.select(selectTeamAdmin);
  userUid$ = this.store.select(selectUserUid);
  isAdmin$ = combineLatest([this.teamAdminId$, this.userUid$]).pipe(map(([teamAdminId, userUid]) => teamAdminId === userUid));

  userColor!: string;

  constructor(
    private readonly store: Store<IAppState>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.userName$.subscribe(username => {
      this.userColor = this.generateColorFromName(username || '');
    });
  }

  private generateColorFromName(name: string): string {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFC107', '#FF9800', '#FF5722', '#795548'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + (hash * 31);
    }

    const index = Math.abs(hash % colors.length);
    return colors[index];
  }

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
