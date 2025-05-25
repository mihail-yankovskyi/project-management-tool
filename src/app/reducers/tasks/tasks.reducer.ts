import { createReducer, on } from '@ngrx/store';
import { getTasksSuccess } from './tasks.actions';
import { ITaskItem } from '../../shared/interfaces/task-item.interface';

export interface ITasksState {
  allTasks: ITaskItem[];
}

export const initialTodoState: ITasksState = {
  allTasks: []
};

export const tasksReducer = createReducer(
  initialTodoState,
  on(getTasksSuccess, (state, { tasks }) => ({
    ...state,
    allTasks: tasks
  }))
);
