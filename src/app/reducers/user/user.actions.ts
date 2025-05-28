import { createAction, props } from '@ngrx/store';

export const login = createAction('[User] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[User] Login Success', props<{ email: string, displayName: string, uid: string }>());
export const loginFailed = createAction('[User] Login Failed');

export const logout = createAction('[User] Logout');

export const register = createAction('[User] Register', props<{ name: string, surname: string, email: string, password: string }>())
export const registerFailed = createAction('[User] Register Failed');

export const setUser = createAction('[User] Set User', props<{ email: string, displayName: string, uid: string }>());
