import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProjectManagementComponent } from './project-management/project-management.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ProjectManagementComponent
  }
];
