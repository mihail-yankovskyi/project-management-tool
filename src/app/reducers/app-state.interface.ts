import { IListsState } from "./lists/lists.reducer";
import { ITasksState } from "./tasks/tasks.reducer";
import { ITeamUsersState } from "./team-users/team-users.reducer";
import { ITeamState } from "./team/team.reducer";
import { IUserState } from "./user/user.reducer";

export interface IAppState {
  user: IUserState;
  tasks: ITasksState;
  team: ITeamState;
  teamUsers: ITeamUsersState;
  lists: IListsState;
}
