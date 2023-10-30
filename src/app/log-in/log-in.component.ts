import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css'],
    standalone: true,
    imports: [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class LogInComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder 
  ) {
    // Initialize the login form using FormBuilder
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  loginForm: FormGroup; // Declare the login form as a FormGroup
  subscription: Subscription | null;
  isLoggedIn$:boolean = false;

  ngOnInit(): void {
    this.subscription = this.auth._currentUser.subscribe((user) => {
      this.isLoggedIn$ = !!!user
    })
  }

  onSignUp() {
    this.router.navigate(['/signup']); 
    // Redirect to the signup page when the Signup button is clicked
  }

  onLogin() {
    if (this.loginForm.valid) {
      // Check if the login form is valid
      // Use form values directly from the FormGroup
      const email = this.loginForm.get('email')?.value; 
      const password = this.loginForm.get('password')?.value; 
      this.auth.logIn(email, password); 
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
    this.subscription.unsubscribe();
  }
}
