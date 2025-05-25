import { createSelector } from "@ngrx/store";
import { IAppState } from "../app-state.interface";
import { ITeamUsersState } from "./team-users.reducer";


export const teamUsersFeature = (state: IAppState): ITeamUsersState => state?.teamUsers;

export const getTeamUsers = (state: ITeamUsersState) => state?.teamUsers;

export const selectTeamUsers = createSelector(teamUsersFeature, getTeamUsers);
