import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUpload } from 'src/app/model/file-upload.model';
import { User} from 'src/app/model/user.model';
import { FirebaseService } from 'src/app/service/firebase.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  EditForm: FormGroup;
  currentUser: User;
  selectedFile: FileList | undefined;
  currentFileUpload: FileUpload | undefined;
  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { uid: string },
    private builder: FormBuilder,
    private firebaseService: FirebaseService,
    public dialogRef: MatDialogRef<EditProfileComponent>
  ) { }

  ngOnInit(): void {
    // Initialize the form with user data
    this.EditForm = this.builder.group({
      userName: ['', [Validators.required, Validators.minLength(4)]],
    });

    // Fetch user data using the provided UID
    this.firebaseService.getUserWithUid(this.data.uid).subscribe((user: User) => {
      this.currentUser = user;
      this.imagePreview = user.profileURL;
      this.EditForm.patchValue({
        userName: user.userName,
      });
    });
  }

   // Handle file selection
  selectFile(event: any): void {
    const file: File | null = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.selectedFile = event.target.files;
    } else {
      this.selectedFile = undefined;
    }
  }

  // Cancel the editing and close the dialog
  onCancel(){
    this.dialogRef.close();
  }

  onSubmit() {
    const newUsername = this.EditForm.get('userName').value;
    const updateObservables = [];
  
    if (newUsername !== this.currentUser.userName) {
      // Username has changed, update it
      updateObservables.push(this.firebaseService.updateUserName(this.currentUser.uid, newUsername));    
    }
  
    // Check if a new profile image is selected
    if (this.selectedFile && this.selectedFile.length > 0) {
      const file: File | null = this.selectedFile.item(0);
  
      if (file) {
        // Create a FileUpload instance
        this.currentFileUpload = new FileUpload(file);
        const reader = new FileReader();
        reader.onload = () => {
        // Set the image preview with the data URL
        this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
        // Update the profile image
        updateObservables.push(
          this.firebaseService.updateProfileImage(this.currentUser.uid, this.currentFileUpload)
        );
      }
    }
  
    if (updateObservables.length === 0) {
      // No updates to perform
      alert('No changes were made.');
      this.dialogRef.close();
      return;
    }
    
    // Use forkJoin to wait for all update observables to complete
    forkJoin(updateObservables).subscribe(
      () => {
        // All updates completed successfully, display an alert
        alert('Changes submitted successfully!');
        this.dialogRef.close();
      },
      (error) => {
        alert('Error updating profile');
      }
    );
  }
    
}

  

