import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../shared/interfaces/user.interface';
import { Store } from '@ngrx/store';
import { IAppState } from '../reducers/app-state.interface';
import { CommonModule } from '@angular/common';
import { removeTeamFromUser } from '../reducers/team-users/team-users.actions';

@Component({
  selector: 'app-team-member',
  imports: [CommonModule],
  templateUrl: './team-member.component.html',
  styleUrl: './team-member.component.scss'
})
export class TeamMemberComponent implements OnInit {
  @Input() user!: IUser;
  @Input() teamId!: string;

  initials!: string;
  userColor!: string;

  constructor(
    private readonly store: Store<IAppState>,
  ) {}

  ngOnInit(): void {
    this.initials = this.getInitials(this.user.displayName);
    this.userColor = this.generateColorFromName(this.user.displayName || '');
  }

  getInitials(fullName: string): string {
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
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

  deleteTeamMember() {
    this.store.dispatch(removeTeamFromUser({ teamId: this.teamId, uid: this.user.uid ?? ''}))
  }
}
