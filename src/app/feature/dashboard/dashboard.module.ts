import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EditProfileComponent } from './edit-profile-dialog/edit-profile.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { PostComponent } from './post-dialog/post.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', component: DashboardComponent },
  ];

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatMenuModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatTabsModule,
      RouterModule.forChild(routes)
    ],
    declarations: [
      DashboardComponent,
      EditProfileComponent,
      PostComponent
    ],
    exports: [
        DashboardComponent,
        EditProfileComponent,
        PostComponent
    ],
    providers: [
      
    ]
  })
  export class DashboardModule {

    constructor() {
  
    }
  
  
  }