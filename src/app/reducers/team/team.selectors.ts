import { createSelector } from "@ngrx/store";
import { IAppState } from "../app-state.interface";
import { ITeamState } from "./team.reducer";

export const todoFeature = (state: IAppState): ITeamState => state?.team;

export const getTeamId = (state: ITeamState) => state?.currentTeam?.id;
export const getTeamName = (state: ITeamState) => state?.currentTeam?.name;
export const getCurrentTeam = (state: ITeamState) => state?.currentTeam;
export const getTeamAdmin = (state: ITeamState) => state?.currentTeam?.teamAdmin;

export const selectTeamId = createSelector(todoFeature, getTeamId);
export const selectTeamName = createSelector(todoFeature, getTeamName);
export const selectCurrentTeam = createSelector(todoFeature, getCurrentTeam);
export const selectTeamAdmin = createSelector(todoFeature, getTeamAdmin);
