import { Component, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { AuthService } from './service/auth.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  
  opened:boolean = false; // Boolean to control the side menu visibility
  subscription: Subscription; // Subscription for handling user login status changes
  isLoggedIn = false; // Flag to track user login status
  @ViewChild('leftSidenav') leftSidenav: MatSidenav; // Reference to the left sidenav element

  constructor(
    private auth: AuthService){}

  ngOnInit(): void {
    this.auth.autoLogin(); // Automatically attempt user login
    
     // Subscribe to user login status changes
    this.subscription = this.auth._isLoggedIn.subscribe((res)=> {
       // Set the 'opened' flag based on the login status
      this.opened = !!res

      // Close the left sidenav if the user logs out
      if (res === false && this.leftSidenav) {
        this.leftSidenav.close();
      }
    });
  }

  // Toggle the visibility of the side menu
  toggleMenu() {
    this.opened = !this.opened;
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }
  }
  