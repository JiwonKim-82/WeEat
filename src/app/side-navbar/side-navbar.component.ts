import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from 'src/app/service/auth.service';
import { MatExpansionPanel, MatExpansionModule } from '@angular/material/expansion';
import { FirebaseService } from '../service/firebase.service';
import { User } from '../auth/auth/model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../service/snackbar.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../auth/auth/store';
import { logout } from '../auth/auth/store/auth.actions';
import { currentUser } from '../auth/auth/store/auth.selectors';

@Component({
    selector: 'app-side-navbar',
    templateUrl: './side-navbar.component.html',
    styleUrls: ['./side-navbar.component.css'],
    standalone: true,
    imports: [MatListModule, RouterLink, MatIconModule, MatExpansionModule, NgFor, MatTooltipModule, NgIf, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule]
})
export class SideNavBarComponent implements OnInit, OnDestroy{

  constructor(
    private auth: AuthService,
    private firebaseService: FirebaseService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store<AuthState>) { 
    }

  // ViewChild references to expansion panels
  @ViewChild('myFriendsPanel') myFriendsPanel: MatExpansionPanel;
  @ViewChild('findFriendsPanel') findFriendsPanel: MatExpansionPanel;
  
  // Component properties
  userUid$: string = ''; // Logged-in User's UID
  friendsList$: User[] = []; // List of user's friends
  searchedUsername: string = ''; // Username being searched
  foundUser$: User = null; // User found in search results
  subscriptions: Subscription[] = []; // Array to store subscriptions
  isMyFriendsPanelOpen: boolean = false; // Flag for myFriendsPanel
  isFindFriendsPanelOpen: boolean = false; // Flag for findFriendsPanel


  ngOnInit() {
    // Subscribe to the current user
    this.subscriptions.push(
      this.store.pipe(select(currentUser)).subscribe((user) => {
        if (user) {
          this.userUid$ = user.uid;
          this.subscribeToFriends();
        }
      })
    );
  }
  
  // Subscribe to the user's friends
  subscribeToFriends() {
    this.subscriptions.push(
      this.firebaseService.getUserFriends(this.userUid$).subscribe((friends) => {
        if (friends) {
          this.friendsList$ = friends || [];
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

  removeFriend(friendUid: string): void {
    const message = `Are you sure you want to delete this friend?`;
    const dialogData = new ConfirmDialogModel("Delete the friend", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "400px",
          data: dialogData
        });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.firebaseService.deleteFriend(this.userUid$, friendUid)
        .then(() => {
          this.snackbarService.show('Friend removed successfully', 'success')
        })
        .catch((error) => {
          this.snackbarService.show('There was an error removing friend. Try again', 'error')
        });
      } else {
      this.snackbarService.show('Friend removal canceled.', 'warning')
      }
    })
  }

  // Search for a user by username
  searchUserByUsername() {
    const userSubscription = this.firebaseService
    .getUserByUsername(this.searchedUsername)
    .pipe(take(1))
    .subscribe((user) => {
      this.foundUser$ = user;
    });
    this.subscriptions.push(userSubscription);
  }

  // Navigate to the found user's dashboard
  toFoundUser(uid: string){
    if (uid) {
      this.router.navigate(['/WeEat/dashboard', uid]);
    }
    this.searchedUsername = ''
  }

  // Log out the user
  onLogOut() {
    this.store.dispatch(logout());
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
