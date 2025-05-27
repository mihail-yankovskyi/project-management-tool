import { createReducer, on } from '@ngrx/store';
import { getTeamDetailsSuccess, removeUserFromTeam, updateTeamDetailsSuccess } from './team.actions';
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
  })),
  on(updateTeamDetailsSuccess, (state, props) => {
    if (state.currentTeam) {
      return {
        ...state,
        currentTeam: {
        ...state.currentTeam,
        ...props.teamData
        }
      };
    } else {
      return { currentTeam: null };
    }
  }),
  on(removeUserFromTeam, (state, { memberId }) => {
    if (state.currentTeam) {
      return {
        ...state,
        currentTeam: {
          ...state.currentTeam,
          members: state.currentTeam.members.filter((uid) => uid !== memberId)
        }
      };
    } else {
      return { currentTeam: null }
    }
  })
);
