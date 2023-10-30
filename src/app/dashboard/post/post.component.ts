import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Post } from 'src/app/model/posting.model';
import { User } from 'src/app/model/user.model';
import { PostingComponent } from 'src/app/search/posting/posting.component';
import { AuthService } from 'src/app/service/auth.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';


@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css'],
    standalone: true,
    imports: [NgIf, MatButtonModule, MatIconModule, MatMenuModule]
})
export class PostComponent {

  selectedPost: Post = null;
  currentUser$: User = null;
  isCurrentUserProfile: boolean|null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { post: Post, isCurrentUserProfile: boolean },
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
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
  }

  onDelete(): void {
    // Confirm deletion with a dialog/modal before proceeding
    const message = `Are you sure you want to delete this post?`;

    const dialogData = new ConfirmDialogModel("Delete this post", message);

    const dialogRef = this.dialogPosting.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.firebaseService.deleteFile(this.currentUser$.uid, this.selectedPost.timestamp).then(
                () => {
                  // Deletion successful
                  this.snackbarService.show('Post deleted successfully.', 'success');
                  this.dialogRef.close();
                },
                (error) => {
                  // Handle the error
                  this.snackbarService.show('Error deleting post.', 'error');          
                }
              );
            }
      })
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
