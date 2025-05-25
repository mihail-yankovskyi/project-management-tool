import { createReducer, on } from '@ngrx/store';
import { getTeamDetailsSuccess } from './team.actions';
import { ITeam } from '../../shared/interfaces/task-item.interface';

export interface ITeamState {
  currentTeam: ITeam | null;
}

export const initialTeamState: ITeamState = {
  currentTeam: null
};

export const teamReducer = createReducer(
  initialTeamState,
  on(getTeamDetailsSuccess, (state, props) => ({
    ...state,
    currentTeam: props.team
  }))
);
