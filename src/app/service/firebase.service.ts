import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { catchError, finalize, map, take } from 'rxjs/operators';
import { FileUpload } from '../model/file-upload.model';
import { Post } from '../model/posting.model';
import { User} from '../model/user.model';
import { SnackbarService } from './snackbar.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService{

  constructor(
    private db: AngularFireDatabase, 
    private storage: AngularFireStorage,
    private snackbarService: SnackbarService) {
   }
  
  pushFileToStorage(fileUpload: FileUpload, post:Post, uid:string): Observable<number | undefined> {
    const timestamp = Date.now().toString(); // Generate a unique post ID.
    const filePath = `/posts/${uid}/${timestamp}`; // Create the file path.
    const storageRef = this.storage.ref(filePath); // Create a reference for file download.
    const uploadTask = this.storage.upload(filePath, fileUpload.file); // Upload the file.
    
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          post.fileUrl = downloadURL;
          this.uploadPost(post, uid, timestamp)
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  // Upload post data to the Realtime Database.
  private uploadPost(post: Post, uid: string, timestamp:string):void {
    post.timestamp = timestamp;
    const userPostRef = this.db.object(`posts/${uid}/${timestamp}`);
    userPostRef.update(post);
  }

  // Update a post in the Realtime Database.
  updatePost(uid: string, timestamp: string, description: string, isFavorite: boolean): Observable<number> {
    return new Observable<number>((observer) => {
      const userPostRef = this.db.object(`posts/${uid}/${timestamp}`);
      const updatedData = {
        description: description,
        isFavorite: isFavorite,
      };
  
      userPostRef.update(updatedData)
        .then(() => {
          observer.next(100); 
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);                     
          observer.complete();
        });
    });
  }

  // Upload a user's profile image to Firebase Storage.
  uploadProfileImage(user: User, fileUpload: FileUpload) {
    const filePath = `user-profiles/${user.uid}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadURL) => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          user.profileURL = downloadURL;
          this.uploadUser(user);
        });
      })
    ).subscribe();
  }
  
  // Upload user data with profileURL to the Realtime Database.
  uploadUser(user: User): void {
    const updates = {};
    updates[user.uid] = user;
    this.db.object(`users`).update(updates);
  }
  
  // Get user data by UID.
  getUserWithUid(uid:string): Observable<User | null>{
    const userPath = `/users/${uid}`;
    return this.db
    .object(userPath)
    .valueChanges()
    .pipe(
      map((userData: User) => userData || null)
    );
  }

  // Get user data by username (case-insensitive search).
  getUserByUsername(username: string): Observable<User | null> {
    const lowercaseUsername = username.toLowerCase().trim();
    return this.db.list<User>('users', ref =>
      ref.orderByChild('userNameLowercase').equalTo(lowercaseUsername)
    ).valueChanges().pipe(
      map(users => (users.length > 0) ? users[0] : null)
    );
  }

  // Update a user's username.
  updateUserName(uid: string, newUserName: string){
    const userPath = `/users/${uid}`;
    const update = {
      userName: newUserName,
      userNameLowercase: newUserName.toLowerCase().trim() // Store the lowercase userName
    };
    return this.db.object(userPath).update(update);
  }

  // Update a user's profile image.
  updateProfileImage(uid: string, file: FileUpload): Observable<void> {
    return new Observable<void>((observer) => {
      const filePath = `user-profiles/${uid}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file.file);
  
      uploadTask.snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe((downloadURL) => {
              file.url = downloadURL;
              file.name = file.file.name;
              const update = { profileURL: downloadURL };
              this.db.object(`users/${uid}`).update(update)
                .then(() => {
                  observer.next(); 
                  observer.complete();
                })
                .catch((error) => {
                  observer.error(error);
                  observer.complete();
                });
            });
          })
        )
        .subscribe();
    });
  }

  // Get a user's profile image URL.
  getProfileImg(uid: string): Observable<string> {
    const userPath = `/users/${uid}`;
    return this.db
      .object(userPath)
      .valueChanges()
      .pipe(
        map((userData: User) => userData ? userData.profileURL : null)
      );
  }

  // Get a user's postings by UID.
  getPostingsByUID(uid: string): Observable<Post[]> {
    const userPostsPath = `/posts/${uid}`;
    return this.db
      .list(userPostsPath)
      .snapshotChanges()
      .pipe(
        map((snapshots) => {
          return snapshots.map((snapshot) => snapshot.payload.val() as Post);
        })
      );
  }
  
  // Add a friend to the user's friends list.
  addFriend(uid: string, foundUser: User) {
    // Reference to the friends list for the logged-in user
    const loggedInUserFriendsRef = this.db.object(`friends/${uid}`);

    // Check if the friend is already in the list to avoid duplicates
    loggedInUserFriendsRef.valueChanges().pipe(take(1)).subscribe((friendsList: any) => {
      if (!friendsList) {
        friendsList = {}; // Initialize an empty object if it doesn't exist
      }

      // Check if the friend is already in the list
      if (!friendsList[foundUser.uid]) {
        const friendInfo = {
          uid: foundUser.uid,
          userName : foundUser.userName,
          profileURL : foundUser.profileURL
        }
        // Add the friend uid, username and profileURL to the list
        friendsList[foundUser.uid] = friendInfo; // Use true as a value to indicate the friend is in the list

        // Update the user's friends list in the database
        loggedInUserFriendsRef.set(friendsList).then(() => {
          this.snackbarService.show('Friend added successfully', 'success');
        }).catch((error) => {
          this.snackbarService.show('There was an error adding a friend. Please try again.', 'error')
        });
      } else {
        this.snackbarService.show('Friend is already in the list.', 'warning');
      }
    });
  }

  // Get a user's friends list by their UID.
  getUserFriends(uid: string): Observable<any> {
    // Reference to the friends list for the user with the specified UID
    const userFriendsListRef = this.db.list(`friends/${uid}`);
    return userFriendsListRef.valueChanges();
  }

  // Delete a friend from the user's friends list.
  deleteFriend(userUid: string, friendUid: string): Promise<void> {
    return this.db.list(`/friends/${userUid}`).remove(friendUid);
  }

  // Delete a post file from both the Realtime Database and Firebase Storage.
  deleteFile(uid: string, timestamp: string): Promise<void> {
    return this.deleteFileDatabase(uid, timestamp)
      .then(() => {
        this.deleteFileStorage(uid, timestamp);
      });
  }

  // Delete the post file data from the Realtime Database.
  private deleteFileDatabase(uid: string, timestamp: string): Promise<void> {
    return this.db.list(`/posts/${uid}`).remove(timestamp);
  }
  
  // Delete the post file from Firebase Storage.
  private deleteFileStorage(uid: string, timestamp: string): void {
    const storageRef = this.storage.ref(`/posts/${uid}`);
    storageRef.child(timestamp).delete();
  }
}




