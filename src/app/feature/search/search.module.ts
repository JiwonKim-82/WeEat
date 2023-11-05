import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PostingComponent } from './posting-dialog/posting.component';
import { SearchComponent } from './search.component';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', component: SearchComponent },
  ];

@NgModule({
    imports: [
      CommonModule,
      MatProgressBarModule,
      MatSlideToggleModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatCardModule,
      MatRippleModule,
      MatProgressSpinnerModule,
      MatIconModule,
      ReactiveFormsModule,
      ImageCropperModule,
      FormsModule,
      RouterModule.forChild(routes)
    ],
    declarations: [
      PostingComponent,
      SearchComponent
    ],
    exports: [
      PostingComponent,
      SearchComponent
    ],
    providers: [
      
    ]
  })
  export class SearchModule {

    constructor() {
  
    }
  
  
  }