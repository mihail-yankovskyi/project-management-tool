import { createAction, props } from '@ngrx/store';
import { IUser } from '../../shared/interfaces/user.interface';

export const getUsers = createAction('[Team Users] Get Users');
export const getUsersSuccess = createAction('[Team Users] Get Users Success', props<{ users: IUser[] }>());
export const getUsersFailed = createAction('[Team Users] Get Users Failed');
