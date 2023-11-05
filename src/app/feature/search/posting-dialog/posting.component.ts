import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from '../../../model/restaurant.model';
import { SearchService } from '../../../service/search.service';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
import { FileUpload } from '../../../model/file-upload.model';
import { FirebaseService } from '../../../service/firebase.service';
import { Post } from '../../../model/posting.model';
import { User } from 'src/app/auth/auth/model/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { Store, select } from '@ngrx/store';
import { AuthState } from 'src/app/auth/auth/reducers';
import { currentUser } from 'src/app/auth/auth/auth.selectors';

@Component({
    selector: 'app-posting',
    templateUrl: './posting.component.html',
    styleUrls: ['./posting.component.css'],
})

export class PostingComponent implements OnInit, OnDestroy{

  editMode:boolean = false;
  editModePosting: Post | null;
  currentUser$: User | null;
  postingForm: FormGroup | null;
  selectedRestaurant$: Restaurant | null;
  selectedFiles: FileList | null;
  private destroy$ = new Subject<void>();
  currentFileUpload: FileUpload | null;
  percentage$:number = 0;
  showProgress: boolean = false
  imageChangedEvent: any = '';
  croppedImageUrl: any = '';
  croppedImageFile: any = '';
  editModeImage : any = '';
  private currentUserSubscription: Subscription;

  constructor(
    private searchService: SearchService,
    private authService: AuthService,
    private FirebaseService: FirebaseService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialog,
    private sanitizer: DomSanitizer,
    private store: Store<AuthState>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { post: Post, editMode: boolean } // Optional injection
  ) {
    // Check if data is provided via injection set editMode
    if (data) {
      this.editMode = data.editMode;
      this.editModePosting = data.post;
    } else {
      this.editMode = false;
      this.editModePosting = null;
    }
  }
  
  ngOnInit() {
    // Always retrieve currentUser
    this.currentUserSubscription = this.store.pipe(select(currentUser))
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentUser => {
        this.currentUser$ = currentUser;
    });
    if (this.editMode) {
      // Set selectedRestaurant and croppedImageUrl directly based on editModePosting
      this.selectedRestaurant$ = this.editModePosting.restaurant;
      this.editModeImage = this.editModePosting.fileUrl;
    } else {
      // In non-edit mode, retrieve selectedRestaurant using a service
      combineLatest(
        this.searchService.getSelectedRestaurant(),
        // Other observables to combine
      ).pipe(takeUntil(this.destroy$)).subscribe(([restaurant, /* Other results */]) => {
        this.selectedRestaurant$ = restaurant;
        // Handle the results of other combined observables
      });
    }
    // Initialize the form for edit or non-edit mode
    this.initForm();
  }
  
  private initForm() {
    if (this.editMode) {
      // Initialize the form for edit mode
      const description = this.editModePosting.description;
      const isFavorite = this.editModePosting.isFavorite
      this.postingForm = new FormGroup({
        'description': new FormControl(description, Validators.required),
        'isFavorite': new FormControl(isFavorite, Validators.required)
      });
    } else {
      // Initialize the form for non-edit mode
      const description = null;
      this.postingForm = new FormGroup({
        'description': new FormControl(description, Validators.required),
        'isFavorite': new FormControl(false, Validators.required)
      });
    }
  }

  // Upload a post
  upload() {
    if (this.editMode) {
      this.showProgress = true;
      // Check if a new file was uploaded
      const newDescription = this.postingForm.get('description').value // Description
      const newIsFavorite = this.postingForm.get('isFavorite').value // isFavorite
      // Update an existing post
      this.FirebaseService.updatePost(
        this.currentUser$.uid, 
        this.editModePosting.timestamp, 
        newDescription, 
        newIsFavorite)
      .subscribe(
        (percentage) => {
          this.percentage$ = Math.round(percentage ? percentage : 0);
            if (percentage === 100) {
              setTimeout(() => {
                this.dialogRef.closeAll();
                this.snackbarService.show('Post updated successfully!', 'success');
              }, 1500);
            }
        },
        error => {
         this.snackbarService.show('Something went wrong!.', 'error');
        }
      );
    }
    if (!this.editMode) {
      if (!this.selectedFiles) {
        // Handle the case where no file is selected by showing an error message to the user
          this.snackbarService.show('Please select a file to upload.', 'warning');
          return; // Exit early if no file is selected
        }
      this.showProgress = true;
      let alertShown = false;
      if (this.croppedImageUrl) {
      const file: File | null = this.croppedImageFile;

      if (file) {
        // Create a FileUpload instance
        this.currentFileUpload = new FileUpload(file);

        // Create a Post instance with the uploaded file URL
        const post = new Post(
          this.selectedRestaurant$, // Restaurant information
          this.postingForm.get('description').value, // Description
          this.postingForm.get('isFavorite').value, // isFavorite
          this.currentFileUpload.url
        );
        // Upload a new post
        this.FirebaseService.pushFileToStorage(
          this.currentFileUpload, 
          post, 
          this.currentUser$.uid)
        .subscribe(
          (percentage) => {
            this.percentage$ = Math.round(percentage ? percentage : 0);
            if (percentage === 100 && !alertShown) {
              alertShown = true; // Set the flag to true to prevent multiple alerts
              setTimeout(() => {
                this.dialogRef.closeAll();
                this.snackbarService.show('Post uploaded successfully!', 'success')
              }, 1500);
            }
          },
          error => {
            this.snackbarService.show('Something went wrong.','error')
          }
        );
      } 
    }}
  } 

  // Handle file selection event
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    const file: File | null = event.target.files[0];
    if (file) {
      this.selectedFiles = event.target.files;
    }
  }

  // Handle image cropping event
  imageCropped(event: ImageCroppedEvent) {
    // Convert the base64 cropped image to a Blob
    this.croppedImageFile = event.blob
    this.croppedImageUrl = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
  }
  
  onCancel(){
    this.dialogRef.closeAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
    localStorage.removeItem('selectedRestaurant');
  }
}