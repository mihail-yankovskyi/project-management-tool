import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
  writeBatch
} from '@angular/fire/firestore';
import { getDoc, getDocs, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IList, ITaskItem, ITasksByList, ITeam } from '../interfaces/task-item.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService{
  private firestore: Firestore;
  private auth: Auth;

  constructor(private authService: AuthService) {
    this.firestore = inject(Firestore);
    this.auth = inject(Auth);
  }

  getLists(activeTeamId?: string): Observable<IList[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const listsRef = collection(this.firestore, 'lists');

          if (activeTeamId) {
            const teamListsQuery = query(listsRef, where('teamId', '==', activeTeamId));
            return (collectionData(teamListsQuery, { idField: 'id' }) as Observable<IList[]>).pipe(
               map((lists) => lists.sort((a, b) => a.order - b.order))
            )
          }
          else {
            const userListsQuery = query(listsRef, where('userId', '==', user.uid));
            return (collectionData(userListsQuery, { idField: 'id' }) as Observable<IList[]>).pipe(
               map((lists) => lists.sort((a, b) => a.order - b.order))
            )
          }
        } else {
          return of([]);
        }
      })
    );
  }

  async createListsForNewUser() {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return Promise.reject(new Error('User is not authenticated'));
      }

      const teamsRef = collection(this.firestore, 'teams');
      const newTeamRef = doc(teamsRef);
      const teamId = newTeamRef.id;
      const batch = writeBatch(this.firestore);

      batch.set(newTeamRef, {
        name: "My Project",
        createdBy: user.uid,
        createdAt: new Date(),
        members: [user.uid],
        teamAdmin: user.uid
      });

      const listsRef = collection(this.firestore, 'lists');
      const defaultLists = [
        { title: "Todo", order: 1 },
        { title: "In Progress", order: 2 },
        { title: "Testing", order: 3 },
        { title: "Closed", order: 4 }
      ];

      const listDocs = defaultLists.map(list => {
        const newDocRef = doc(listsRef);
        batch.set(newDocRef, {
          title: list.title,
          userId: user.uid,
          order: list.order,
          teamId: teamId,
          createdAt: new Date()
        });
        return newDocRef;
      });

      await batch.commit();
      await this.authService.updateUserWithTeamId(user.uid, teamId);

      return { teamId, listDocs };
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  async addList(title: string) {
    const user = this.auth.currentUser;
    if (user) {
      const listsRef = collection(this.firestore, 'lists');
      return await addDoc(listsRef, {
        title,
        userId: user.uid,
        order: Date.now()
      });
    } else {
      return Promise.reject(new Error('User is not authenticated'));
    }
  }

  getTasksByList(listId: string): Observable<ITaskItem[]> {
    const tasksRef = collection(this.firestore, 'tasks');
    const listTasksQuery = query(tasksRef, where('listId', '==', listId));
    return collectionData(listTasksQuery, { idField: 'id' }) as Observable<ITaskItem[]>;
  }

  getAllTasksGrouped(teamId: string = ''): Observable<ITasksByList> {
    const listsRef = collection(this.firestore, 'lists');
    const teamListsQuery = query(listsRef, where('teamId', '==', teamId));

    return collectionData(teamListsQuery, { idField: 'id' }).pipe(
      switchMap((lists: any[]) => {
        const listIds = lists.map(list => list.id);

        if (listIds.length === 0) {
          return of([]);
        }

        const tasksRef = collection(this.firestore, 'tasks');
        const teamTasksQuery = query(tasksRef, where('listId', 'in', listIds));

        return collectionData(teamTasksQuery, { idField: 'id' });
      }),
      map((tasks: any[]) => {
        const groupedTasks: { [listId: string]: ITaskItem[] } = {};

        tasks.forEach((task) => {
          const taskItem: ITaskItem = {
            id: task.id,
            listId: task.listId,
            title: task.title,
            showedId: task.showedId,
            description: task.description,
            userId: task.createdByUserId,
            assignedTo: task.assignedTo,
            createdOn: task.createdOn,
            dueDate: task.dueDate,
            estimatedStoryPoints: task.estimatedStoryPoints,
            actualStoryPoints: task.actualStoryPoints,
            order: task.order
          };

          if (!groupedTasks[task.listId]) {
            groupedTasks[task.listId] = [];
          }
          groupedTasks[task.listId].push(taskItem);
        });

        return groupedTasks;
      })
    );
  }

  async getNextTaskId(): Promise<number> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error ('no');
    }

    const counterRef = doc(this.firestore, `counters/${user.uid}`);

    const newId = await runTransaction(this.firestore, async (transaction) => {
      const counterDoc = await transaction?.get(counterRef);

      if (!counterDoc.exists()) {
        transaction.set(counterRef, { taskCounter: 1 });
        return 1;
      }

      const currentCounter = counterDoc.data()?.['taskCounter'] || 0;
      const nextCounter = currentCounter + 1;

      transaction.update(counterRef, { taskCounter: nextCounter });

      return nextCounter;
    })
    return newId;
  }

  async addTask(
    listId: string,
    title: string,
    description: string,
    dueDate: string,
    estimatedStoryPoints: number = 0,
    ) {
    const user = this.auth.currentUser;
    const showedId = await this.getNextTaskId();
    if (user) {
      const tasksRef = collection(this.firestore, 'tasks');
      return await addDoc(tasksRef, {
        title,
        description,
        listId,
        showedId,
        createdByUserId: user.uid,
        assignedTo: user.uid,
        createdOn: new Date(),
        order: Date.now(),
        dueDate,
        estimatedStoryPoints,
        actualStoryPoints: null
      });
    } else {
      return Promise.reject(new Error('User is not authenticated'));
    }
  }

  async updateTask(task: ITaskItem) {
    const taskRef = doc(this.firestore, `tasks/${task.id}`);
    return await updateDoc(taskRef, { ...task });
  }

  async deleteTask(taskId: string) {
    const taskRef = doc(this.firestore, `tasks/${taskId}`);
    return await deleteDoc(taskRef);
  }

  async moveTask(taskId: string, newListId: string, newOrder: number) {
    const taskRef = doc(this.firestore, `tasks/${taskId}`);
    return await updateDoc(taskRef, {
      listId: newListId,
      order: newOrder
    });
  }

  getUserTeams(): Observable<ITeam[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const teamsRef = collection(this.firestore, 'teams');
          const userTeamsQuery = query(teamsRef, where('members', 'array-contains', user.uid));
          return collectionData(userTeamsQuery, { idField: 'id' }).pipe(
            map((teams) => teams.map(team => team as ITeam))
          );
        } else {
          return of([] as ITeam[]);
        }
      })
    );
  }

  updateTeam(teamId: string, teamData: Partial<ITeam>): Observable<any> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const teamRef = doc(this.firestore, 'teams', teamId);
          const updateData = {
            ...teamData,
            updatedAt: serverTimestamp()
          };

          return from(updateDoc(teamRef, updateData));
        } else {
          return throwError(() => new Error('User not authenticated'));
        }
      })
    );
  }

  getTeamLists(teamId: string): Observable<IList[]> {
    const listsRef = collection(this.firestore, 'lists');
    const teamListsQuery = query(listsRef, where('teamId', '==', teamId));
    return collectionData(teamListsQuery, { idField: 'id' }) as Observable<IList[]>;
  }

  async createTeam(teamName: string): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) {
      return Promise.reject(new Error('User is not authenticated'));
    }

    const teamsRef = collection(this.firestore, 'teams');
    const teamData = {
      name: teamName,
      createdBy: user.uid,
      createdAt: new Date(),
      members: [user.uid]
    };

    const docRef = await addDoc(teamsRef, teamData);
    return docRef.id;
  }

  async addMemberToTeam(teamId: string, userEmail: string): Promise<any> {
    if (!teamId || !userEmail) {
      return Promise.reject(new Error('Team ID and user email are required'));
    }

    try {
      const teamRef = doc(this.firestore, `teams/${teamId}`);
      const teamSnap = await getDoc(teamRef);

      if (!teamSnap.exists()) {
        return Promise.reject(new Error('Team not found'));
      }

      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', userEmail.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error(userEmail);
        return Promise.reject(new Error('User not found'));
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      const userData = userDoc.data();
      const teamData = teamSnap.data();
      const members = teamData?.['members'] || [];

      if (members.includes(userId)) {
        const userRef = doc(this.firestore, `users/${userId}`);
        if (userData['teamId'] !== teamId) {
          await updateDoc(userRef, { teamId: teamId });
        }
        return { id: userId, ...userData, teamId };
      }

      await updateDoc(teamRef, {
        members: [...members, userId]
      });

      const userRef = doc(this.firestore, `users/${userId}`);
      await updateDoc(userRef, {
        teamId: teamId
      });

      return { id: userId, ...userData, teamId };
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  updateListsTitles(updates: { id: string; title: string }[]): Observable<any> {
    const updatePromises = updates.map(update => {
      const listDoc = doc(this.firestore, 'lists', update.id);
      return updateDoc(listDoc, { title: update.title });
    });

    return from(Promise.all(updatePromises));
  }
}
