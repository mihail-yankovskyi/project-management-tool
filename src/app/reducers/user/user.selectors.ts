import { createSelector } from "@ngrx/store";
import { IAppState } from "../app-state.interface";
import { IUserState } from "./user.reducer";

export const userFeature = (state: IAppState): IUserState => state?.user;

export const getUserName = (state: IUserState) => state?.displayName;

export const selectUserName = createSelector(userFeature, getUserName);
