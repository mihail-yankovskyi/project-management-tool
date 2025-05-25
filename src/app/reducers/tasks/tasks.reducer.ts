import { createReducer, on } from '@ngrx/store';
import { getTasksSuccess } from './tasks.actions';
import { ITasksByList } from '../../shared/interfaces/task-item.interface';

export interface ITasksState {
  allTasks: ITasksByList | null;
}

export const initialTodoState: ITasksState = {
  allTasks: null
};

export const tasksReducer = createReducer(
  initialTodoState,
  on(getTasksSuccess, (state, { tasks }) => ({
    ...state,
    allTasks: tasks
  }))
);
