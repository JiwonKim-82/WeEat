import { Component, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { AuthService } from './service/auth.service';
import { Observable, Subscription, map, tap } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthState } from './auth/auth/reducers';
import { Store, select } from '@ngrx/store';
import { isLoggedIn } from './auth/auth/auth.selectors';
import { loginFailure, loginSuccess } from './auth/auth/auth.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  
  opened:boolean = false; // Boolean to control the side menu visibility
  subscription: Subscription; // Subscription for handling user login status changes
  opened$: Observable<boolean>; // Observable to track user login status
  @ViewChild('leftSidenav') leftSidenav: MatSidenav; // Reference to the left sidenav element

  constructor(
    private auth: AuthService, private store: Store<AuthState>){ }

  ngOnInit(): void {

    const userProfile = localStorage.getItem('user');
    if(userProfile){
      console.log(userProfile + 'hi')
      this.store.dispatch(loginSuccess({user: JSON.parse(userProfile)}))
    }

    this.opened$ = this.store
      .pipe(
        select(isLoggedIn)
      );
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }
  }
  