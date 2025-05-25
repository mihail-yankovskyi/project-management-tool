import { createAction, props } from '@ngrx/store';
import { ITeam } from '../../shared/interfaces/task-item.interface';

export const getTeamDetails = createAction('[Tasks] Get Team Details');
export const getTeamDetailsSuccess = createAction('[Tasks] Get Team Details Success', props<{ team: ITeam }>());
export const getTeamDetailsFailed = createAction('[Tasks] Get Team Details Failed');
