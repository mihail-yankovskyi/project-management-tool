import { createSelector } from "@ngrx/store";
import { IAppState } from "../app-state.interface";
import { ITasksState } from "./tasks.reducer";

export const tasksFeature = (state: IAppState): ITasksState => state?.tasks;

export const getAllTasks = (state: ITasksState) => state?.allTasks;

export const selectAllTasks = createSelector(tasksFeature, getAllTasks);
