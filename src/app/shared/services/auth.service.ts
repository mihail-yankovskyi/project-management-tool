import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from '@angular/fire/auth';
import { BehaviorSubject, from, map, Observable, switchMap, tap } from 'rxjs';
import { IRegister } from '../interfaces/register.interface';
import { Router } from '@angular/router';
import { ILogin } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map((user) => !!user));

  constructor(private auth: Auth, private router: Router) {}

  register(userData: IRegister): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, userData.email, userData.password)).pipe(
      switchMap(({ user }) =>
        from(updateProfile(user, { displayName: userData.name + ' ' + userData.surname, photoURL: null})).pipe(
          switchMap(() => from(Promise.resolve(user)))
        )
      )
    );
  }

  login(userLoginData: ILogin): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, userLoginData.email, userLoginData.password)).pipe(
      map(({ user }) => user),
      tap(() => this.router.navigate(['/']))
    );
  }

  checkIsLoggedIn(): void {
    this.auth.onAuthStateChanged((user) => {
      this.user$.next(user);
    });
  }

  // Log out the user
  // logout(): Observable<void> {
  //   return from(signOut(this.auth));
  // }

  // Get the currently logged-in user
  // getCurrentUser(): User | null {
  //   return this.auth.currentUser;
  // }
}
