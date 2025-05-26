import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout, setUser } from './user.actions';

export interface IUserState {
  displayName: string;
  email: string;
  isLoggedIn: boolean;
}

export const initialUserState: IUserState = {
  displayName: '',
  email: '',
  isLoggedIn: false,
};

export const userReducer = createReducer(
  initialUserState,
  on(loginSuccess, (state, { email, displayName }) => ({
    ...state,
    email,
    displayName,
    isLoggedIn: true,
  })),
  on(logout, () => initialUserState),
  on(setUser, (state, { email, displayName }) => ({
    ...state,
    email,
    displayName,
    isLoggedIn: true,
  })),
);
