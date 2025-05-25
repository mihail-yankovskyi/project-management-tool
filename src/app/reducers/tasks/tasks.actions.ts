import { createAction, props } from '@ngrx/store';
import { ITaskItem } from '../../shared/interfaces/task-item.interface';

export const getTasks = createAction('[Tasks] Get Tasks');
export const getTasksSuccess = createAction('[Tasks] Get Tasks Success', props<{ tasks: ITaskItem[] }>());
export const getTasksFailed = createAction('[Tasks] Get Tasks Failed');
