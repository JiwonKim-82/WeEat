import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FirebaseService } from '../../service/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { User } from '../../auth/auth/model/user.model';
import { Post } from '../../model/posting.model';
import { EditProfileComponent } from './edit-profile-dialog/edit-profile.component';
import { PostComponent } from './post-dialog/post.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/auth/auth/reducers';
import { currentUser } from 'src/app/auth/auth/auth.selectors';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    })
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private store:Store<AuthState>
  ) {}
  
  currentUser: User = null; // Current user information
  routeUser: User = null; // User information based on the route
  posts$: Post[] = []; // User's posts
  favoritePosts$: Post[]= []; // User's favorite posts
  subscriptions: Subscription[] = []; // Array to store subscriptions
  routeUid$: string = ''; // Store the UID from the route parameter
  isCurrentUserProfile: boolean = false; // Flag to determine if it's the current user's profile
  loadingPosts$: boolean = true; // Flag to indicate that posts are still loading
  private destroy$ = new Subject<void>(); // Subject to manage component destruction

  ngOnInit(): void {
    this.route.params.pipe(
      // Unsubscribe when the component is destroyed
      takeUntil(this.destroy$)
    ).subscribe((params) => {
      this.routeUid$ = params['id'];
      const userString = localStorage.getItem('user');
      
      if (userString) {
        const userObject = JSON.parse(userString);
        const localUid = userObject.uid;
        
        // Check if the local 'uid' matches the route parameter 'id'
        this.isCurrentUserProfile = this.routeUid$ === localUid;
        
        // Fetch user data and posts based on the route UID
        this.fetchUserDataAndPosts(this.routeUid$);
      } else {
        // Handle the case when 'user' is not present in local storage
        this.isCurrentUserProfile = false;
        // Fetch user data and posts based on the route UID
        this.fetchUserDataAndPosts(this.routeUid$);
      }
    });
  }

  private fetchUserDataAndPosts(uid: string) {
    // Fetch the user data for the specified UID
    if (!this.isCurrentUserProfile) {
      this.subscriptions.push(
        this.firebaseService.getUserWithUid(uid)
          .pipe(takeUntil(this.destroy$))
          .subscribe((user) => {
            // Check if the user data is not found or the UID is invalid
            if (!user) {
              // Retrieve the UID of the currently logged-in user
              const userUid$ = localStorage.getItem('UID')
              alert("User doesn't exist") 
             // Navigate to the profile of the currently logged-in user
              this.router.navigate(['/dashboard', userUid$]); 
            }
            this.routeUser = user;
          })
      );
    }
    // Fetch the currently logged-in user's data
    this.subscriptions.push(
      this.store.pipe(select(currentUser))
        .pipe(
          filter((user) => !!user),
          takeUntil(this.destroy$)
        )
        .subscribe((user) => {
          this.currentUser = user;
          this.getPosts(uid);
        })
    );
  }

  private getPosts(uid: string) {
    this.subscriptions.push(
      this.firebaseService.getPostingsByUID(uid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((posts) => {
          this.posts$ = posts;
          this.favoritePosts$ = this.posts$.filter((post) => post.isFavorite);
          this.loadingPosts$ = false;
        })
    );
  }

  openProfileEditDialog(uid: string) {
    // Open a dialog for editing the user's profile
    this.dialogRef.open(EditProfileComponent, {
      height: 'auto',
      width: '500px',
      data: { uid: uid }, // Pass the currentUser$ object as data
    });
  }

  addFriends() {
    // Adding friends
    const uid = this.currentUser.uid;
    const foundUser = this.routeUser;
    this.firebaseService.addFriend(uid, foundUser);
  }

  openPostDialog(post: Post, isCurrentUserProfile: boolean) {
    // Open a dialog to view a selected post
    this.dialogRef.open(PostComponent, {
      height: 'auto',
      width: '850px',
      data: { post: post, isCurrentUserProfile: isCurrentUserProfile }, // Pass the selected post and isCurrentUserProfile
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());

    // Complete the destroy$ subject to signal that the component is being destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}
