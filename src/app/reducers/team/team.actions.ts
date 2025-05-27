import { createAction, props } from '@ngrx/store';
import { ITeam } from '../../shared/interfaces/task-item.interface';

export const getTeamDetails = createAction('[Team] Get Team Details');
export const getTeamDetailsSuccess = createAction('[Team] Get Team Details Success', props<{ team: ITeam }>());
export const getTeamDetailsFailed = createAction('[Team] Get Team Details Failed');

export const updateTeamDetails = createAction('[Team] Update Team Detais', props<{ teamId: string, teamData: Partial<ITeam> }>());
export const updateTeamDetailsSuccess = createAction('[Team] Update Team Details Success', props<{ teamId: string, teamData: Partial<ITeam> }>());
export const updateTeamDetailsFailed = createAction('[Team] Update Team Details Failed');

export const removeUserFromTeam = createAction('[Team] Remove User From Team', props<{ memberId: string }>());
