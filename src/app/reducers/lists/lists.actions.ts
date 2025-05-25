import { createAction, props } from '@ngrx/store';
import { IList } from '../../shared/interfaces/task-item.interface';

export const getLists = createAction('[Tasks] Get Lists');
export const getListsSuccess = createAction('[Tasks] Get Lists Success', props<{ lists: IList[] }>());
export const getListsFailed = createAction('[Tasks] Get Lists Failed');

export const updateListsTitles = createAction('[Tasks] Update Lists Titles', props<{ updates: { id: string; title: string }[] }>());
export const updateListsTitlesSuccess = createAction('[Tasks] Update Lists Titles Success', props<{ updates: { id: string; title: string }[] }>());
export const updateListsTitlesFailed = createAction('[Tasks] Update Lists Titles Failed');

export const setListsLoading = createAction('[Tasks] Set Lists Loading', props<{ isLoading: boolean }>());
