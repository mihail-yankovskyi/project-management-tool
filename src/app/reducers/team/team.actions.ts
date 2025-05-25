import { createAction, props } from '@ngrx/store';
import { ITeam } from '../../shared/interfaces/task-item.interface';

export const getTeamDetails = createAction('[Tasks] Get Team Details');
export const getTeamDetailsSuccess = createAction('[Tasks] Get Team Details Success', props<{ team: ITeam }>());
export const getTeamDetailsFailed = createAction('[Tasks] Get Team Details Failed');

export const updateTeamDetails = createAction('[Tasks] Update Team Detais', props<{ teamId: string, teamData: Partial<ITeam> }>());
export const updateTeamDetailsSuccess = createAction('[Tasks] Update Team Details Success', props<{ teamId: string, teamData: Partial<ITeam> }>());
export const updateTeamDetailsFailed = createAction('[Tasks] Update Team Details Failed');
