import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth, 
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  _isLoggedIn = new BehaviorSubject<Boolean>(false);  // BehaviorSubject to track whether the user is logged in or not
  _currentUser = new BehaviorSubject<User>(null); // BehaviorSubject to store the current user information
  _userName = new BehaviorSubject<string>(''); // BehaviorSubject to store the user's display name

  // Define constants for error messages
  private readonly USER_NOT_FOUND = 'User not found. Please check your email.';
  private readonly WRONG_PASSWORD = 'Wrong password. Please try again.';
  private readonly WRONG_CREDENTIALS = 'Wrong email or password. Try again';
  private readonly EMAIL_EXISTS = 'Email is already in use. Please choose another email.'
  private readonly REQUEST_FAILED = 'Network request failed. Please check your internet connection.'

  logIn(email: string, password: string) {

    // log in using Firebase Authentication
    this.fireAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {

        // Successful login
        alert('Log in Success!');

        // Retrieve user data from Firebase Firestore and navigate
        this.loadUserData(userCredential.user.uid);
        })
      .catch((error) => {
        const errorCode = error.code;
        // Handle different authentication error cases
        switch (errorCode) {
          case 'auth/user-not-found':
            alert(this.USER_NOT_FOUND);
            break;
          case 'auth/wrong-password':
            alert(this.WRONG_PASSWORD);
            break;
          default:
            alert(this.WRONG_CREDENTIALS);
          }
        // Navigate to the login page on error
        this.router.navigate(['/login']);
    });
  }
    
  private loadUserData(uid: string) {
    // Retrieve user data from Firebase Firestore
    this.firebaseService.getUserWithUid(uid).subscribe((userData) => {

      // Update the _currentUser BehaviorSubject with user data
      this._currentUser.next(userData);

      // Save user data for future auto Login
      this.saveUserData(uid);

      // Update authentication status
      this._isLoggedIn.next(true);

      // Navigate to the user's dashboard with parameter of uid
      this.router.navigate(['/dashboard', uid]);
    }, (error) => {
      console.error('Error loading user data:', error);
    });
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
      alert('Registration Successful');

      // Return the created User object
      return newUser;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert(this.EMAIL_EXISTS);
      } else if (error.code === 'auth/network-request-failed') {
        alert(this.REQUEST_FAILED);
      } else {
        alert('An error occurred during registration. Please try again later.');
      }

      // Return null or an appropriate value when an error occurs
      return null;
    }
  }
  
  // async getUserName(): Promise<any> {
  //   //Extract Username from userCredential returned
  //   const user = await this.fireAuth.currentUser;
  //   if (user && user.displayName) {
  //     this._userName.next(user.displayName);
  //     return user.displayName;
  //   } else {
  //     return '';
  //   }
  // }

  autoLogin() {
    //Get stored UID from local storage
    const UID = localStorage.getItem('UID');
    if (UID) {
      // Retrieve user data from Firebase Firestore
      this.firebaseService.getUserWithUid(UID).subscribe((user)=> {this._currentUser.next(user)})
      // Update authentication status
      this._isLoggedIn.next(true)
    }
  }

  logOut(){
    this.fireAuth.signOut().then( () => {
      //clear Local storage
      localStorage.clear();
      // Update user status and authentication status
      this._currentUser.next(null);
      this._isLoggedIn.next(false)
    }, err => {
      alert('Something went wrong');
    }
    )
  }

  private saveUserData(uid: string) {
    localStorage.setItem('UID', uid);
  }
}