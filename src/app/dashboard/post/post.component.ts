import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Post } from 'src/app/model/posting.model';
import { User } from 'src/app/model/user.model';
import { PostingComponent } from 'src/app/search/posting/posting.component';
import { AuthService } from 'src/app/service/auth.service';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  selectedPost: Post = null;
  currentUser$: User = null;
  isCurrentUserProfile: boolean|null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { post: Post, isCurrentUserProfile: boolean },
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<PostComponent>,
    private dialogPosting: MatDialog
  ) {
    // Initialize selectedPost and isCurrentUserProfile from the injected data
    this.selectedPost = data.post;
    this.isCurrentUserProfile = data.isCurrentUserProfile;
  }

  ngOnInit(): void {
    // Subscribe to user changes to get the current user
    this.authService._currentUser.subscribe((user)=>{this.currentUser$ = user})
    console.log(this.isCurrentUserProfile)
  }

  onDelete(): void {
    // Confirm deletion with a dialog/modal before proceeding
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      this.firebaseService.deleteFile(this.currentUser$.uid, this.selectedPost.timestamp).then(
        () => {
          // Deletion successful
          alert('Post deleted successfully');
          this.dialogRef.close();
        },
        (error) => {
          // Handle the error
          alert('Error deleting post');
        }
      );
    }
  }

  onEdit(): void {
    // Open the Post Editing Dialog
    this.dialogPosting.open(PostingComponent, {
      height: '600px',
      width: '1000px',
      // Pass restaurant data and edit mode
      data: { post: this.selectedPost, editMode: true },
    });
  }
}
