import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { register } from '../reducers/user/user.actions';

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
    private store: Store
  ) {}

  register() {
    this.store.dispatch(register({
      name: this.name!.value!,
      surname: this.surname!.value!,
      email: this.email!.value!,
      password: this.password!.value!
    }))
  }
}
