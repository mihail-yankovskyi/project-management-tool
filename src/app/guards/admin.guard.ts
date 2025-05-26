import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectTeamAdmin } from '../reducers/team/team.selectors';

export const adminGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const store = inject(Store);

  const teamAdmin$ = store.select(selectTeamAdmin)

  return authState(auth).pipe(
    take(1),
    withLatestFrom(teamAdmin$),
    filter(([user, teamAdminId]) => {
      console.log(teamAdminId);
      return !!user && !!teamAdminId
    }),
    map(([user, teamAdminId]) => {
      if (user?.uid === teamAdminId) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
