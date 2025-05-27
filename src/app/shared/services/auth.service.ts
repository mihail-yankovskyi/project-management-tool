import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User, UserCredential } from '@angular/fire/auth';
import { from, map, Observable, switchMap } from 'rxjs';
import { IRegister } from '../interfaces/register.interface';
import { Store } from '@ngrx/store';
import { setUser } from '../../reducers/user/user.actions';
import {
  Firestore,
  collection,
  doc,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { arrayRemove, DocumentReference, getDoc, getDocs, writeBatch } from 'firebase/firestore';
import { IUser } from '../interfaces/user.interface';
import { getTeamDetails } from '../../reducers/team/team.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firestore: Firestore;
  private auth: Auth;

  constructor(
    private store: Store,
  ) {
    this.firestore = inject(Firestore);
    this.auth = inject(Auth);
  }

  register(userData: IRegister): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, userData.email, userData.password)).pipe(
      switchMap(({ user }) => {
        return from(updateProfile(user, { displayName: userData.name + ' ' + userData.surname, photoURL: null})).pipe(
          switchMap(() => {
            const userRef = doc(this.firestore, `users/${user.uid}`);
            const newUser = {
              uid: user.uid,
              email: user.email,
              displayName: userData.name + ' ' + userData.surname,
              teamId: null,
              createdAt: new Date()
            };
            return from(setDoc(userRef, newUser)).pipe(
              map(() => user)
            );
          })
        );
      })
    );
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  checkIsLoggedIn(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.store.dispatch(setUser({ email: user.email || '', displayName: user.displayName || '' }));
        this.store.dispatch(getTeamDetails());
      }
    });
  }

  async updateUserWithTeamId(userId: string, teamId: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${userId}`);

      await updateDoc(userRef, {
        teamId: teamId
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  updateUserTeamId(email: string, teamId: string): Promise<void> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));

    return getDocs(q)
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          throw new Error(email);
        }

        const userId = querySnapshot.docs[0].id;
        const userDocRef = doc(this.firestore, 'users', userId);

        return updateDoc(userDocRef, {
          teamId: teamId
        });
      });
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        return null;
      }

      const userData = userSnapshot.data();

      return {
        displayName: userData['displayName'] || '',
        email: userData['email'] || '',
        teamId: userData['teamId'] || null,
        uid: userData['uid'] || userId
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const usersCollectionRef = collection(this.firestore, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      const users = usersSnapshot.docs.map(doc => {
      const userData = doc.data();

        return {
          displayName: userData['displayName'] || '',
          email: userData['email'] || '',
          teamId: userData['teamId'] || null,
          uid: userData['uid'] || doc.id
        };
      });

      return users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeUserFromTeam(teamId: string, userId: string): Promise<void> {
    try {
      const batch = writeBatch(this.firestore);
      const teamRef: DocumentReference = doc(this.firestore, 'teams', teamId);
      const userRef: DocumentReference = doc(this.firestore, 'users', userId);

      batch.update(teamRef, {
        members: arrayRemove(userId)
      });

      batch.update(userRef, {
        teamId: null
      });

      await batch.commit();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
