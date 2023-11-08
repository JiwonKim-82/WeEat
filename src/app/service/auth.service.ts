import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, of, switchMap, tap, throwError } from 'rxjs';
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
  
  logIn(email: string, password: string): Observable<User> {
    return from(this.fireAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        this.snackbarService.show('Log in Success!', 'success');
        return this.loadUserData(userCredential.user.uid);
      }),
      catchError((error) => this.handleLoginError(error))
    );
  }
    
  private loadUserData(uid: string): Observable<User> {
    return this.firebaseService.getUserWithUid(uid).pipe(
      tap((userData) => {
        this.router.navigate(['/WeEat/dashboard', userData.uid]);
      }),
      catchError((error) => {
        this.snackbarService.show('Logged out', 'error');
        return of(null); // Return a null user object on error
      })
    );
  }

  signUp(email: string, password: string, userName: string): Observable<User> {
    return new Observable((observer) => {
      this.fireAuth.createUserWithEmailAndPassword(email, password)
        .then((resData) => {
              const uid = resData.user.uid;
              this.snackbarService.show('Registration Successful', 'success');
              const user = new User(uid, userName, userName.toLowerCase().trim(), email, password);
              observer.next(user);
              observer.complete();
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            this.snackbarService.show('Email already in use', 'error');
          } else if (error.code === 'auth/network-request-failed') {
            this.snackbarService.show('Network request failed', 'error');
          } else {
            this.snackbarService.show('An error occurred during registration. Please try again later.', 'error');
          }
          observer.next(null);
          observer.complete();
        });
    });
  }

  private handleLoginError(error: any): Observable<never> {
    let errorMessage: string;

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Wrong password';
    } else {
      errorMessage = 'Something went wrong';
    }

    this.snackbarService.show(errorMessage, 'error');
    return throwError(errorMessage);
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