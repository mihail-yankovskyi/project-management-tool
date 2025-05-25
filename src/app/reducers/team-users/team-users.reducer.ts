import { createReducer, on } from '@ngrx/store';
import { IUser } from '../../shared/interfaces/user.interface';
import { getUsersSuccess } from './team-users.actions';

export interface ITeamUsersState {
  teamUsers: IUser[];
}

export const initialUserState: ITeamUsersState = {
  teamUsers: [{uid: null, displayName: 'Unassigned'}]
};

export const teamUsersReducer = createReducer(
  initialUserState,
  on(getUsersSuccess, (state, { users }) => ({
    ...state,
    teamUsers: [
      ...users,
      {uid: null, displayName: 'Unassigned'}
    ]
  }))
);
