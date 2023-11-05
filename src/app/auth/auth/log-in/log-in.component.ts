import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Observable, Subscription, noop, tap } from 'rxjs';
import { AuthState } from '../reducers';
import { Store, select } from '@ngrx/store';
import { login } from '../auth.actions';
import { isLoggedOut } from '../auth.selectors';
import { AuthActions } from '../action-types';
import { User } from '../model/user.model';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AuthState>
  ) {
    // Initialize the login form using FormBuilder
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  loginForm: FormGroup; // Declare the login form as a FormGroup
  subscription: Subscription | null;
  isLoggedOut$: Observable<boolean>;

  ngOnInit(): void {
    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut))
  }

  onSignUp() {
    this.router.navigate(['/signup']); 
  }

  onLogin() {
    if (this.loginForm.valid) {
      const val = this.loginForm.value;
  
      this.store.dispatch(AuthActions.login({ email: val.email, password: val.password }))
      
    }
  }

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email'); 
    if (emailControl?.hasError('required')) {
      return 'Enter your Email';
    }
    return emailControl?.hasError('email') ? 'Not a valid email' : ''; 
  }

  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password'); 
    if (passwordControl?.hasError('required')) {
      return 'Enter your Password'; 
    }
    return passwordControl?.hasError('minlength') ? 'Password should be a minimum of 8 characters' : ''; 
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
