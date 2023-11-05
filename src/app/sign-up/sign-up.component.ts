import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../auth/auth/model/user.model';
import { AuthService } from '../service/auth.service';
import { FileUpload } from '../model/file-upload.model';
import { FirebaseService } from '../service/firebase.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';

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
    private auth: AuthService
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

  async handleSignUp() {
    if (this.rgForm.valid) {
      const userCredential = await this.auth.signIn(
        this.rgForm.value.email,
        this.rgForm.value.password,
        this.rgForm.value.userName
      );

      if (!this.selectedFile) {
        const lowercaseName = this.rgForm.value.userName.toLowerCase().trim();
        const user = new User(
          userCredential.uid,
          userCredential.userName,
          lowercaseName,
          userCredential.email,
          'assets/images/default-profile-image.webp'
        );
        await this.firebaseService.uploadUser(user);
      } else {
        const file = this.selectedFile.item(0);
        const fileUpload = new FileUpload(file);
        const lowercaseName = userCredential.userName.toLowerCase().trim();
        const user = new User(
          userCredential.uid,
          userCredential.userName,
          lowercaseName,
          userCredential.email,
          userCredential.password
        );
        await this.firebaseService.uploadProfileImage(user, fileUpload);
      }
      this.router.navigate(['/login']);
    } 
  }

}