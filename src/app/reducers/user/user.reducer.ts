import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout, setUser } from './user.actions';

export interface IUserState {
  displayName: string;
  email: string;
  isLoggedIn: boolean;
  uid: string | null;
}

export const initialUserState: IUserState = {
  displayName: '',
  email: '',
  isLoggedIn: false,
  uid: null
};

export const userReducer = createReducer(
  initialUserState,
  on(loginSuccess, (state, { email, displayName, uid }) => ({
    ...state,
    email,
    displayName,
    uid,
    isLoggedIn: true,
  })),
  on(logout, () => initialUserState),
  on(setUser, (state, { email, displayName, uid }) => ({
    ...state,
    email,
    displayName,
    uid,
    isLoggedIn: true,
  }))
);
