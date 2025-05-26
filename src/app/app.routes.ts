import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { loginGuard } from './guards/login.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    component: ProjectManagementComponent,
    canActivate: [authGuard]
  }
];
