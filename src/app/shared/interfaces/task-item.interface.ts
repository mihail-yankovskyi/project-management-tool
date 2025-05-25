export interface ITaskItem {
  id: string;
  listId: string;
  title: string;
  showedId: number;
  description: string;
  userId: string;
  assignedTo?: string;
  createdOn: string;
  dueDate?: string;
  estimatedStoryPoints: number;
  actualStoryPoints: number;
  // assigneePhotoUrl?: string;
  order?: number;
}

export interface IList {
  id: string;
  title: string;
  userId: string;
  order: number;
  teamId: string
}

export interface ITeam {
  createdAt?: any;
  createdBy: string;
  id: string;
  members: string[];
  teamAdmin: string;
  name: string;
}
