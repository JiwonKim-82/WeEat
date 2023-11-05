import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, of, switchMap, switchMapTo, tap } from 'rxjs';
import { User } from '../auth/auth/model/user.model';
import { FirebaseService } from './firebase.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth, 
    private router: Router,
    private firebaseService: FirebaseService,
    private snackbarService: SnackbarService
  ) {}

  _userName = new BehaviorSubject<string>(''); // BehaviorSubject to store the user's display name
  // Define constants for error messages
  private readonly USER_NOT_FOUND = 'User not found. Please check your email.';
  private readonly WRONG_PASSWORD = 'Wrong password. Please try again.';
  private readonly WRONG_CREDENTIALS = 'Wrong email or password. Try again';
  private readonly EMAIL_EXISTS = 'Email is already in use. Please choose another email.'
  private readonly REQUEST_FAILED = 'Network request failed. Please check your internet connection.'
  
  logIn(email: string, password: string): Observable<User> {
    return from(this.fireAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        this.snackbarService.show('Log in Success!', 'success');
        return this.loadUserData(userCredential.user.uid);
      }),
      catchError((error) => {
        const errorCode = error.code;
        let errorMessage: string;
        // Handle different authentication error cases
        switch (errorCode) {
          case 'auth/user-not-found':
            errorMessage = 'User not found';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Wrong password';
            break;
          default:
            errorMessage = 'Wrong credentials';
        }
        this.snackbarService.show(errorMessage, 'error');
        throw new Error(errorMessage); // Throw an error on login failure
      })
    );
  }
    
  private loadUserData(uid: string): Observable<User> {
    return this.firebaseService.getUserWithUid(uid).pipe(
      tap((userData) => {
        console.log(userData);
        this.router.navigate(['/WeEat/dashboard', userData.uid]);
      }),
      catchError((error) => {
        this.snackbarService.show('Logged out', 'error');
        return of(null); // Return a null user object on error
      })
    );
  }

    
  //Register a new user with provided email, password, and username
  async signIn(email: string, password: string, userName: string): Promise<User | null> {
    try {

      // Create a new user account using Firebase Authentication
      const resData = await this.fireAuth.createUserWithEmailAndPassword(email, password);

      // Extract the user's unique ID (UID) from the authentication result
      const uid = resData.user.uid;

      // Update the user's profile to set their display name to the provided username
      await resData.user.updateProfile({ displayName: userName });

      // Create a new User object with the user's information
      // Here, userName is stored both in its original form and as lowercase with trimmed spaces
      const newUser = new User(uid, userName, userName.toLowerCase().trim(), email, password);

      // Display a success message to the user
      this.snackbarService.show('Registration Successful', 'success');

      // Return the created User object
      return newUser;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        this.snackbarService.show(this.EMAIL_EXISTS, 'error');

      } else if (error.code === 'auth/network-request-failed') {
        this.snackbarService.show(this.REQUEST_FAILED, 'error');
      } else {
        this.snackbarService.show('An error occurred during registration. Please try again later.', 'error');
      }

      // Return null or an appropriate value when an error occurs
      return null;
    }
  }

  logOut(){
    return this.fireAuth.signOut().then( () => {
      this.snackbarService.show('Log out Success!', 'success');
    }, err => {
      this.snackbarService.show('Something went wrong', 'error');
    }
    )
  }

}