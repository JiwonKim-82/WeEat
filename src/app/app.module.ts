import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material.module';

import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { PostingComponent } from './search/posting/posting.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


import { environment } from 'src/environments/environment.development';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { PostComponent } from './dashboard/post/post.component';
import { EditProfileComponent } from './dashboard/edit-profile/edit-profile.component';
import { SideNavBarComponent } from './side-navbar/side-navbar';
import { ImageCropperModule } from 'ngx-image-cropper';




@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    DashboardComponent,
    SearchComponent,
    PostingComponent,
    HeaderComponent,
    PostComponent,
    EditProfileComponent,
    SideNavBarComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    MaterialModule,
    ImageCropperModule
],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
