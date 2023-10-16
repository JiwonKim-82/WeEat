import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from 'src/app/service/auth.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FirebaseService } from '../service/firebase.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavBarComponent implements OnInit, OnDestroy{

  constructor(
    private auth: AuthService,
    private firebaseService: FirebaseService,
    private router: Router) { 
    }

  // ViewChild references to expansion panels
  @ViewChild('myFriendsPanel') myFriendsPanel: MatExpansionPanel;
  @ViewChild('findFriendsPanel') findFriendsPanel: MatExpansionPanel;
  
  // Component properties
  userUid: string = ''; // Logged-in User's UID
  friendsList: User[] = []; // List of user's friends
  searchedUsername: string = ''; // Username being searched
  foundUser: User = null; // User found in search results
  subscriptions: Subscription[] = []; // Array to store subscriptions
  isMyFriendsPanelOpen: boolean = false; // Flag for myFriendsPanel
  isFindFriendsPanelOpen: boolean = false; // Flag for findFriendsPanel

  ngOnInit() {
    // Subscribe to the current user
    this.subscriptions.push(
      this.auth._currentUser.subscribe((user) => {
        if (user) {
          this.userUid = user.uid;
          this.subscribeToFriends();
        }
      })
    );
  }
  
  // Subscribe to the user's friends
  subscribeToFriends() {
    this.subscriptions.push(
      this.firebaseService.getUserFriends(this.userUid).subscribe((friends) => {
        if (friends) {
          this.friendsList = friends || [];
        }
      })
    );
  }
  
  // Toggle expansion panels
  toggleExpansionPanel(number: number): void {
    if (number === 1) {
      this.myFriendsPanel.toggle();
      this.isMyFriendsPanelOpen = this.myFriendsPanel.expanded;
    }
  
    if (number === 2) {
      this.findFriendsPanel.toggle();
      this.isFindFriendsPanelOpen = this.findFriendsPanel.expanded;
    }
  }

  // Remove a friend
  removeFriend(friendUid: string): void {
    const confirmed = window.confirm('Are you sure you want to remove this friend?');
    if (confirmed) {
      this.firebaseService.deleteFriend(this.userUid, friendUid)
        .then(() => {
          alert('Friend removed successfully');
        })
        .catch((error) => {
          alert('There was an error removing friend. Try again');
        });
    } else {
      alert('Friend removal canceled.');
    }
  }

  // Search for a user by username
  searchUserByUsername() {
    const userSubscription = this.firebaseService
    .getUserByUsername(this.searchedUsername)
    .pipe(take(1))
    .subscribe((user) => {
      this.foundUser = user;
    });
    this.subscriptions.push(userSubscription);
  }

  // Navigate to the found user's dashboard
  toFoundUser(uid: string){
    if (uid) {
      this.router.navigate(['/dashboard', uid]);
    }
    this.searchedUsername = ''
  }

  // Log out the user
  onLogOut() {
    this.auth.logOut();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions in the array
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

}
