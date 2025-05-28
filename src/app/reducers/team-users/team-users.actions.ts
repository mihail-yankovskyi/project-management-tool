import { createAction, props } from '@ngrx/store';
import { IUser } from '../../shared/interfaces/user.interface';

export const getUsers = createAction('[Team Users] Get Users');
export const getUsersSuccess = createAction('[Team Users] Get Users Success', props<{ users: IUser[] }>());
export const getUsersFailed = createAction('[Team Users] Get Users Failed');

export const removeTeamFromUser = createAction('[Team Users] Remove Team From User', props<{ teamId: string, uid: string }>());
export const removeTeamFromUserSuccess = createAction('[Team Users] Remove Team From User Success', props<{ teamId: string, uid: string }>());
export const removeTeamFromUserFailed = createAction('[Team Users] Remove Team From User Failed');

export const addUser = createAction('[Team Users] Add User', props<{ teamId: string, email: string }>());
export const addUserSuccess = createAction('[Team Users] Add User Success', props<{ user: IUser }>());
export const addUserFailed = createAction('[Team Users] Add User Failed');
