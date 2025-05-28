import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { filter, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectTeamAdmin } from '../reducers/team/team.selectors';
import { combineLatest } from 'rxjs';

export const adminGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const store = inject(Store);

  const teamAdmin$ = store.select(selectTeamAdmin);
  const user$ = authState(auth);

  return combineLatest([user$, teamAdmin$]).pipe(
    filter(([user, teamAdminId]) => !!user && !!teamAdminId),
    take(1),
    map(([user, teamAdminId]) => {
      if (user!.uid === teamAdminId) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
