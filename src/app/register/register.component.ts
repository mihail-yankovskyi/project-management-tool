import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../shared/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, CommonModule]
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);

  registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    secondPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
  });

  get name() {
    return this.registerForm.get('name');
  }

  get surname() {
    return this.registerForm.get('surname');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get secondPassword() {
    return this.registerForm.get('secondPassword');
  }

  constructor (
    private authService: AuthService, private router: Router
  ) {}

  register() {
    this.authService.register({
      name: this.name?.value!,
      surname: this.surname?.value!,
      email: this.email?.value!,
      password: this.password?.value!
    }).subscribe({
      next: user => {
        console.log(user);
        this.router.navigate(['/'])
      },
      error: err => alert('Error: ' + err.message),
    });
  }
}
