import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthService } from '../../../service/auth.service';
import { FileUpload } from '../../../model/file-upload.model';
import { FirebaseService } from '../../../service/firebase.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { AuthState } from '../store';
import { AuthActions } from '../store/action-types';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
    standalone: true,
    imports: [MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, MatButtonModule, MatTooltipModule]
})
export class SignUpComponent implements OnInit{

  constructor(
    private builder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private auth: AuthService,
    private store: Store<AuthState>
  ) {}

  user: User|null;
  selectedFile?: FileList|null;
  imagePreview: string | undefined;
  rgForm: FormGroup|null;
  
 ngOnInit(): void {
  this.rgForm = this.builder.group({
    userName: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(4)])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
    password: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(8)])),
    passwordCheck: this.builder.control('', Validators.compose([Validators.required])),
  }, {
    validator: this.passwordMatchValidator 
  });
 } 

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password1 = control.get('password').value;
    const password2 = control.get('passwordCheck').value;

  if (password1 !== password2) {
    return { 'PasswordNoMatch': true };
  }
    return null;
  }

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

  handleSignUp() {
    let fileUpload: FileUpload | null = null; 
  
    if (this.selectedFile) {
      const file = this.selectedFile.item(0);
      fileUpload = new FileUpload(file); 
    }
  
    const user = {
      email: this.rgForm.value.email,
      password: this.rgForm.value.password,
      displayName: this.rgForm.value.userName,
      file: fileUpload, 
    };
  
    this.store.dispatch(AuthActions.signup(user));
  }

}