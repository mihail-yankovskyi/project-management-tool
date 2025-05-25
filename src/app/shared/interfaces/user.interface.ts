export interface IUser {
  createdAt?: Date;
  displayName: string;
  email?: string;
  teamId?: string | null;
  uid: string | null;
}
