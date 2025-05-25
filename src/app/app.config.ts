import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environment/environment';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { userReducer } from './reducers/user/user.reducer';
import { UserEffects } from './reducers/user/user.effects';
import { TasksEffects } from './reducers/tasks/tasks.effects';
import { TeamUsersEffects } from './reducers/team-users/team-users.effects';
import { teamUsersReducer } from './reducers/team-users/team-users.reducer';
import { listsReducer } from './reducers/lists/lists.reducer';
import { ListsEffects } from './reducers/lists/lists.effects';
import { TeamEffects } from './reducers/team/team.effects';
import { teamReducer } from './reducers/team/team.reducer';
import { tasksReducer } from './reducers/tasks/tasks.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStore({
      user: userReducer,
      lists: listsReducer,
      tasks: tasksReducer,
      team: teamReducer,
      teamUsers: teamUsersReducer
    }),
    provideEffects([UserEffects, TeamEffects, TasksEffects, TeamUsersEffects, ListsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
