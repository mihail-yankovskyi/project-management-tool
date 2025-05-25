import { createSelector } from "@ngrx/store";
import { IAppState } from "../app-state.interface";
import { IListsState } from "./lists.reducer";

export const todoFeature = (state: IAppState): IListsState => state?.lists;

export const getAllLists = (state: IListsState) => state?.allLists;
export const getListsIsLoading = (state: IListsState) => state?.isLoading;

export const selectAllLists = createSelector(todoFeature, getAllLists);
export const selectAllListsIsLoading = createSelector(todoFeature, getListsIsLoading);
